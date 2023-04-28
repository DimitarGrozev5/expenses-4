import { type BudgetCategoryWithExpenses } from "prisma/types";

type Props = {
  category: BudgetCategoryWithExpenses;
};

// Utility fn that calculates flex-grow prop for what's left
const leftFlex = (cat: BudgetCategoryWithExpenses) => {
  const expenses = cat.expenses.reduce((sum, e) => sum + +e.amount, 0);

  const flexVal = Math.round(
    (+cat.startOfPeriodAmount / (Math.abs(expenses) || 1)) * 100
  );

  return Math.max(1, flexVal);
};

const CategoryDailyOverview: React.FC<Props> = ({ category }) => {
  const totalSpent = category.expenses.reduce((sum, e) => sum + +e.amount, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const spentToday = category.expenses
    .filter((e) => e.createdOn >= today)
    .reduce((sum, e) => sum + +e.amount, 0);

  return <div className="flex">Daily overview</div>;
};

export default CategoryDailyOverview;
