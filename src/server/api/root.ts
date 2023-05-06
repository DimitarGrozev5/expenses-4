import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { expensesAccountRouter } from "./routers/account";
import { categoriesRouter } from "./routers/categories";
import { expensesRouter } from "./routers/expenses";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  accounts: expensesAccountRouter,
  categories: categoriesRouter,
  expenses: expensesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
