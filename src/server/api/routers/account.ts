import { Prisma, type ExpenseAccount, type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AddFundsToAccountSchema } from "~/components/forms/add-funds-to-account-form";
import { NewAccountSchema } from "~/components/forms/new-account-form.types";
import { AccountCurrentAmountSchema } from "~/components/forms/set-account-curr-amount";
import { TransferFundsSchema } from "~/components/forms/transfer-funds-form";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export type AccountExport = ExpenseAccount & {
  mainAccountForUser: User | null;
};

export const expensesAccountRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.prisma.$transaction(async (tr) => {
        const accounts = await tr.expenseAccount.findMany({
          where: { user: { id: ctx.session.user.id } },
          orderBy: { accountOrder: "asc" },
          include: { mainAccountForUser: true },
        });

        const categories = await tr.budgetCategory.findMany({
          where: { user: { id: ctx.session.user.id } },
          include: { expenses: true },
        });

        const totalCategoryAmount = categories.reduce((acc, curr) => {
          const currExpenses = curr.expenses.reduce((acc, curr) => {
            return acc + +curr.amount;
          }, 0);

          return acc + +curr.startOfPeriodAmount - currExpenses;
        }, 0);

        const mainAccountCorrection = accounts.map((acc) => {
          if (acc.mainAccountForUser) {
            return {
              ...acc,
              initAmount: new Prisma.Decimal(
                +acc.initAmount + totalCategoryAmount
              ),
            };
          }

          return acc;
        });

        return mainAccountCorrection;
      });
      return result;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred, please try again later.",
        cause: error,
      });
    }
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tr) => {
          const account = await tr.expenseAccount.findUnique({
            where: { id: input },
            include: { mainAccountForUser: true },
          });

          if (!account || account.userId !== ctx.session.user.id) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Account not found.",
            });
          }

          if (!account.mainAccountForUser) {
            return account;
          }

          const categories = await tr.budgetCategory.findMany({
            where: { user: { id: ctx.session.user.id } },
            include: { expenses: true },
          });

          const totalCategoryAmount = categories.reduce((acc, curr) => {
            const currExpenses = curr.expenses.reduce((acc, curr) => {
              return acc + +curr.amount;
            }, 0);

            return acc + +curr.startOfPeriodAmount - currExpenses;
          }, 0);

          return {
            ...account,
            initAmount: new Prisma.Decimal(
              +account.initAmount + totalCategoryAmount
            ),
          };
        });

        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),

  findByName: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.expenseAccount.findMany({
        where: { name: { contains: input }, user: { id: ctx.session.user.id } },
        orderBy: { accountOrder: "asc" },
      });
    }),

  addAccount: protectedProcedure
    .input(NewAccountSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const maxAccountOrderItem = await ctx.prisma.expenseAccount.findMany({
          where: { user: { id: ctx.session.user.id } },
          select: {
            accountOrder: true,
          },
          orderBy: {
            accountOrder: "desc",
          },
          take: 1,
        });

        const maxAccountOrder = maxAccountOrderItem[0]?.accountOrder ?? 0;

        const newExpenseAccount = await ctx.prisma.expenseAccount.create({
          data: {
            accountOrder: maxAccountOrder + 1,
            name: input.name,
            initAmount: input.initValue,
            currentAmount: input.initValue,
            user: { connect: { id: ctx.session.user.id } },
          },
        });

        if (maxAccountOrderItem.length === 0) {
          await ctx.prisma.user.update({
            where: { id: ctx.session.user.id },
            data: {
              mainAccount: { connect: { id: newExpenseAccount.id } },
            },
          });
        }

        return newExpenseAccount;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),

  addFundsToAccount: protectedProcedure
    .input(AddFundsToAccountSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tr) => {
          const newData = await tr.expenseAccount.update({
            where: { id: input.accountId },
            data: {
              initAmount: { increment: input.amount },
            },
          });

          if (newData.userId !== ctx.session.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You cannot add funds to this account",
            });
          }

          if (newData.initAmount.toNumber() < 0) {
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message:
                "If you subtract this amount, your account will go bellow zero",
            });
          }

          return newData;
        });

        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),

  setCurrentAmount: protectedProcedure
    .input(AccountCurrentAmountSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tr) => {
          if (input.accountId === null) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Please select an account",
            });
          }

          const newData = await tr.expenseAccount.update({
            where: { id: input.accountId },
            data: { currentAmount: input.amount },
          });

          if (newData.userId !== ctx.session.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You cannot add funds to this account",
            });
          }

          return newData;
        });

        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),

  transferFunds: protectedProcedure
    .input(TransferFundsSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.fromAccountId === null || input.toAccountId === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please select both a *from* account and a *to* account",
        });
      }

      if (input.fromAccountId === input.toAccountId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "From account and to account must be different",
        });
      }

      try {
        await ctx.prisma.$transaction(async (tr) => {
          if (input.fromAccountId === null || input.toAccountId === null) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Please select both a *from* account and a *to* account",
            });
          }

          const accFrom = await tr.expenseAccount.update({
            where: { id: input.fromAccountId },
            data: {
              credit: { increment: input.amount },
            },
          });
          const accTo = await tr.expenseAccount.update({
            where: { id: input.toAccountId },
            data: {
              credit: { decrement: input.amount },
            },
          });

          // Check if the user is the owner
          if (
            accFrom.userId !== ctx.session.user.id ||
            accTo.userId !== ctx.session.user.id
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You cannot transfer funds between these accounts",
            });
          }

          // Check if balance has reached zero in one of the accounts
          const accFromBalance =
            accFrom.initAmount.toNumber() + accFrom.credit.toNumber();
          const accToBalance =
            accTo.initAmount.toNumber() + accTo.credit.toNumber();

          if (accFromBalance < 0 || accToBalance < 0) {
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message:
                "If you transfer this amount, your account will go bellow zero",
            });
          }
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),
});
