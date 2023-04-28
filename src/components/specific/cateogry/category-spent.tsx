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

// Utility fn that calculates flex-grow prop for spent amount
const spentFlex = (cat: BudgetCategoryWithExpenses) => {
  const expenses = cat.expenses.reduce((sum, e) => sum + +e.amount, 0);

  const flexVal = Math.round(
    (Math.abs(expenses) / (+cat.startOfPeriodAmount || 1)) * 100
  );

  return Math.max(1, flexVal);
};

const CategorySpent: React.FC<Props> = ({ category }) => {
  const monthlyExpenses =
    category?.expenses.reduce((sum, e) => sum + +e.amount, 0) || 0;
    
  return (
    <div className="flex">
      <div
        className="flex min-w-[20%] flex-col items-center px-1 py-1"
        style={{ flex: leftFlex(category) }}
      >
        <span className="text-md">
          {(+category.startOfPeriodAmount - monthlyExpenses).toFixed(2)}лв
        </span>
        <span className="text-xs">What&apos;s left</span>
      </div>
      <div
        className="flex min-w-[20%] flex-col items-center bg-red-300 px-1 py-1  text-red-900"
        style={{ flex: spentFlex(category) }}
      >
        <span className="text-md">
          {monthlyExpenses.toFixed()}
          лв
        </span>
        <span className="text-xs">Spent</span>
      </div>
    </div>
  );
};

export default CategorySpent;
