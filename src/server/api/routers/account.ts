import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AddFundsToAccountSchema } from "~/components/forms/add-funds-to-account-form";
import { NewAccountSchema } from "~/components/forms/new-account-form.types";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const expensesAccountRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.expenseAccount.findMany({
      orderBy: { accountOrder: "asc" },
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.expenseAccount.findUnique({
        where: { id: input },
      });
    }),

  addAccount: protectedProcedure
    .input(NewAccountSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const maxAccountOrderItem = await ctx.prisma.expenseAccount.findMany({
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

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
