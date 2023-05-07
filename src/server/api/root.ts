import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { expensesAccountRouter } from "./routers/account";
import { categoriesRouter } from "./routers/categories";
import { expensesRouter } from "./routers/expenses";
import { reasonsRouter } from "./routers/reasons";

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
  reasons: reasonsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
