import { type BudgetCategory, type Expense } from "@prisma/client";

export type BudgetCategoryWithExpenses = BudgetCategory & {
  expenses: Expense[];
};
