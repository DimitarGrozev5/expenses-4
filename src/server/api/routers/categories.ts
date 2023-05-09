import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { NewCategorySchema } from "~/components/forms/new-category-form";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.prisma.budgetCategory.findMany({
        where: { user: { id: ctx.session.user.id } },
        orderBy: { categoryOrder: "asc" },
        include: { expenses: true },
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
        const result = await ctx.prisma.budgetCategory.findUnique({
          where: { id: input },
          include: { expenses: true },
        });

        if (!result || result.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Account not found.",
          });
        }

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
      return await ctx.prisma.budgetCategory.findMany({
        where: { name: { contains: input }, user: { id: ctx.session.user.id } },
        orderBy: { categoryOrder: "asc" },
      });
    }),

  addCategory: protectedProcedure
    .input(NewCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newCat = await ctx.prisma.$transaction(async (tr) => {
          const maxCategoryOrderItem = await tr.budgetCategory.findMany({
            where: { user: { id: ctx.session.user.id } },
            select: {
              categoryOrder: true,
            },
            orderBy: {
              categoryOrder: "desc",
            },
            take: 1,
          });

          const maxACategoryOrder = maxCategoryOrderItem[0]?.categoryOrder ?? 0;

          const newBudgetCategory = await tr.budgetCategory.create({
            data: {
              categoryOrder: maxACategoryOrder + 1,
              name: input.name,
              montlyInput: input.montlyInput,
              startOfPeriodAmount: input.initAmount,
              trackDaily: input.trackDaily,
              trackMonthly: input.trackMonthly,
              user: { connect: { id: ctx.session.user.id } },
            },
          });

          const user = await tr.user.findUnique({
            where: { id: ctx.session.user.id },
            include: { mainAccount: true },
          });

          if (!user || !user.mainAccount) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message:
                "Main account not set. Please create an Expense Account before creating a Budget Category!",
            });
          }

          if (
            +user.mainAccount.initAmount <
            +newBudgetCategory.startOfPeriodAmount
          ) {
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message:
                "Your main account does not have enough funds to create this category. Please add funds to your main account before creating a budget category.",
            });
          }

          await tr.expenseAccount.update({
            where: { id: user.mainAccount.id },
            data: { initAmount: { decrement: input.montlyInput } },
          });

          return newBudgetCategory;
        });

        return newCat;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),
});
