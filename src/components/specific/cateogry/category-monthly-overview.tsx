import { type BudgetCategoryWithExpenses } from "prisma/types";

type Props = {
  category: BudgetCategoryWithExpenses;
};

// Utility fn that calculates flex-grow prop for montly input
const budgetFlex = (cat: BudgetCategoryWithExpenses) => {
  const flexVal = Math.round(
    (+cat.montlyInput / (+cat.startOfPeriodAmount - +cat.montlyInput || 1)) *
      100
  );

  return Math.max(1, flexVal);
};

// Utility fn that calculates flex-grow prop for start of period amount
const startFlex = (cat: BudgetCategoryWithExpenses) => {
  const flexVal = Math.round(
    ((+cat.startOfPeriodAmount - +cat.montlyInput) / (+cat.montlyInput || 1)) *
      100
  );

  return Math.max(1, flexVal);
};

const CategoryMonthlyOverview: React.FC<Props> = ({ category }) => {
  return (
    <div className={"flex"}>
      <div
        className="flex min-w-[20%] flex-col items-center bg-gray-300 px-1 py-1"
        style={{ flex: startFlex(category) }}
      >
        <span className="text-md">
          {(+category.startOfPeriodAmount - +category.montlyInput).toFixed(2)}
          лв
        </span>
        <span className="text-xs">Accumulated</span>
      </div>
      <div
        className="flex min-w-[20%] flex-col items-center bg-green-200 px-1 py-1 text-green-900"
        style={{ flex: budgetFlex(category) }}
      >
        <span className="text-md">
          {(+category.montlyInput).toFixed()}
          лв
        </span>
        <span className="text-xs">Budget</span>
      </div>
    </div>
  );
};

export default CategoryMonthlyOverview;
