import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const reasonsRouter = createTRPCRouter({
  findByTag: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.reason.findMany({
        where: { tag: { contains: input }, user: { id: ctx.session.user.id } },
        orderBy: { timesUsed: "desc" },
        take: 5,
      });
    }),

  // addExpense: protectedProcedure
  //   .input(NewExpenseSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const newExp = await ctx.prisma.$transaction(async (tr) => {
  //         // Data validation
  //         if (input.fromAcountId === null || input.categoryId === null) {
  //           throw new TRPCError({
  //             code: "BAD_REQUEST",
  //             message: "Please select both a *from* account and a category",
  //           });
  //         }
  //         if (input.reasons.length === 0) {
  //           throw new TRPCError({
  //             code: "BAD_REQUEST",
  //             message: "Please enter a reason for the expense",
  //           });
  //         }

  //         // Get user
  //         const user = await tr.user.findUnique({
  //           where: { id: ctx.session.user.id },
  //           include: { mainAccount: true },
  //         });

  //         if (!user || !user.mainAccount) {
  //           throw new TRPCError({
  //             code: "NOT_FOUND",
  //             message:
  //               "Main account not set. Please create an Expense Account before creating a Budget Category!",
  //           });
  //         }

  //         // Move money from selected account to main account if needed
  //         if (user.mainAccount.id !== input.fromAcountId) {
  //           const fromAccount = await tr.expenseAccount.update({
  //             where: { id: input.fromAcountId },
  //             data: {
  //               credit: { increment: input.amount },
  //             },
  //           });

  //           const mainAcccount = await tr.expenseAccount.update({
  //             where: { id: user.mainAccount.id },
  //             data: {
  //               credit: { decrement: input.amount },
  //             },
  //           });

  //           const fromAccountBalance =
  //             +fromAccount.initAmount - +fromAccount.credit;
  //           const mainAcccountBalance =
  //             +mainAcccount.initAmount - +mainAcccount.credit;

  //           if (fromAccountBalance < 0 || mainAcccountBalance < 0) {
  //             throw new TRPCError({
  //               code: "BAD_REQUEST",
  //               message: "Insufficient funds to complete transaction",
  //             });
  //           }
  //         }

  //         // Create or update reasons
  //         const reasons = await Promise.all(
  //           input.reasons.map(async (tag) => {
  //             const reason = await tr.reason.upsert({
  //               where: { tag },
  //               update: { timesUsed: { increment: 1 } },
  //               create: { tag, user: { connect: { id: ctx.session.user.id } } },
  //             });

  //             return reason;
  //           })
  //         );

  //         // Create expense and conncet it to the reasons
  //         const newExpense = await tr.expense.create({
  //           data: {
  //             createdOn: input.createdOn,
  //             amount: input.amount,
  //             category: { connect: { id: input.categoryId } },
  //             user: { connect: { id: ctx.session.user.id } },
  //             reasons: {
  //               create: reasons.map((reason) => ({
  //                 reason: { connect: { id: reason.id } },
  //               })),
  //             },
  //           },
  //         });

  //         return newExpense;
  //       });

  //       return newExp;
  //     } catch (error) {
  //       if (error instanceof TRPCError) {
  //         throw error;
  //       }

  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "An unexpected error occurred, please try again later.",
  //         cause: error,
  //       });
  //     }
  //   }),
});
