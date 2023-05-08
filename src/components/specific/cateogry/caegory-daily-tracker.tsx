import { addMonths, differenceInCalendarDays } from "date-fns";
import { type BudgetCategoryWithExpenses } from "prisma/types";
import { useMemo } from "react";
import { api } from "~/utils/api";

type Props = {
  category: BudgetCategoryWithExpenses;
};

// Utility fn that calculates flex-grow prop based on values
const getFlex = (top: number, bottom: number) => {
  const flexVal = Math.round((top / (bottom || 1)) * 100);
  return Math.max(1, flexVal);
};

const CategoryDailyOverview: React.FC<Props> = ({ category }) => {
  const { data: user } = api.user.getUserBaseData.useQuery();

  const dailyData = useMemo(() => {
    const totalSpent = category.expenses.reduce((sum, e) => sum + +e.amount, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const spentToday = category.expenses
      .filter((e) => e.createdOn >= today)
      .reduce((sum, e) => sum + +e.amount, 0);

    const spentUntilToday = totalSpent - spentToday;
    const lastPeriodStart = user?.lastPeriodStart;
    if (!lastPeriodStart) {
      return null;
    }

    const nextPeriodStart = addMonths(lastPeriodStart, 1);
    const daysLeft = differenceInCalendarDays(nextPeriodStart, today) + 5;

    const leftUntilNextPeriod = +category.montlyInput - spentUntilToday;

    const averagePerDayLeft = leftUntilNextPeriod / daysLeft;
    const leftForToday = averagePerDayLeft - spentToday;

    return [averagePerDayLeft, spentToday, leftForToday] as const;
  }, [category.expenses, category.montlyInput, user?.lastPeriodStart]);

  if (dailyData === null) {
    return null;
  }

  return (
    <>
      <div className="flex">
        {dailyData[2] >= 0 ? (
          <>
            <div
              className="flex min-w-[20%] flex-col items-center bg-green-200 px-1 py-1"
              style={{ flex: getFlex(dailyData[2], dailyData[1]) }}
            >
              <span className="text-md">
                {dailyData[2].toFixed(2)}
                лв
              </span>
              <span className="text-xs">Left for today</span>
            </div>
            <div
              className="flex min-w-[20%] flex-col items-center bg-red-200 px-1 py-1"
              style={{ flex: getFlex(dailyData[1], dailyData[2]) }}
            >
              <span className="text-md">
                {dailyData[1].toFixed(2)}
                лв
              </span>
              <span className="text-xs">Spent today</span>
            </div>
          </>
        ) : (
          <>
            <div
              className="flex min-w-[20%] flex-col items-center bg-yellow-100 px-1 py-1"
              style={{ flex: getFlex(dailyData[0], -1 * dailyData[2]) }}
            >
              <span className="text-md">
                {dailyData[0].toFixed(2)}
                лв
              </span>
              <span className="text-xs">Daily budget</span>
            </div>
            <div
              className="flex min-w-[20%] flex-col items-center bg-red-200 px-1 py-1"
              style={{ flex: getFlex(-1 * dailyData[2], dailyData[0]) }}
            >
              <span className="text-md">
                {(-1 * dailyData[2]).toFixed(2)}
                лв
              </span>
              <span className="text-xs">Overspent</span>
            </div>
          </>
        )}
      </div>
      <div className="h-1 w-full bg-gray-200"></div>
    </>
  );
};

export default CategoryDailyOverview;
