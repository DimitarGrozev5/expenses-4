import Card from "../layout/card";
import clsx from "clsx";
import { useDialog } from "../layout/dialog";
import { api } from "~/utils/api";
import { Skeleton } from "@mui/material";
import { type BudgetCategoryWithExpenses } from "prisma/types";

type Props = {
  forCategory: BudgetCategoryWithExpenses;
};

// Utility fn that calculates flex-grow prop for initAmount
const initFlex = (cat: BudgetCategoryWithExpenses) => {
  const expenses = cat.expenses.reduce((sum, e) => sum + +e.amount, 0);

  const flexVal = Math.round(
    (+cat.startOfPeriodAmount / (Math.abs(expenses) || 1)) * 100
  );

  return Math.max(1, flexVal);
};

// Utility fn that calculates flex-grow prop for credit
const creditFlex = (cat: BudgetCategoryWithExpenses) => {
  const expenses = cat.expenses.reduce((sum, e) => sum + +e.amount, 0);

  const flexVal = Math.round(
    (Math.abs(expenses) / (+cat.startOfPeriodAmount || 1)) * 100
  );

  return Math.max(1, flexVal);
};

const CategoryMainCard: React.FC<Props> = ({ forCategory }) => {
  // Fetch data
  const {
    data: category,
    isLoading,
    error,
  } = api.categories.getById.useQuery(forCategory.id, {
    initialData: forCategory,
  });

  // Setup modal controls
  const addFundsDialogCtrl = useDialog();

  return (
    <>
      {isLoading && <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />}
      {error && <Card className="text-red-500">{error.message}</Card>}

      {category && (
        <Card noPadding>
          <div className="bg-gray-500 py-1 text-center text-gray-100">
            {category.name}
          </div>

          <div className="flex">
            <div
              className={clsx("flex flex-col items-center px-1 py-1")}
              style={{ flex: initFlex(category) }}
            >
              <span className="text-md">
                {(+category.startOfPeriodAmount).toFixed(2)}лв
              </span>
              <span className="text-xs">Free funds</span>
            </div>
            <div
              className={clsx(
                "flex flex-col items-center bg-red-300 px-1 py-1 text-red-900"
              )}
              style={{ flex: creditFlex(category) }}
            >
              <span className="text-md">
                {category.expenses
                  .reduce((sum, e) => sum + +e.amount, 0)
                  .toFixed()}
                лв
              </span>
              <span className="text-xs">Credit</span>
            </div>
          </div>

          <div
            className={clsx(
              "flex flex-col items-center py-1",
              +category.credit <= 0
                ? "bg-green-100 text-green-900"
                : "bg-red-100 text-red-900"
            )}
          >
            <span className="text-md">
              {Math.abs(+category.startOfPeriodAmount).toFixed(2)}
              лв
            </span>
            <span className="text-xs">Should have</span>
          </div>

          {/* <div className="flex justify-around bg-gray-300 px-4 py-2">
            <ButtonPlain onClick={addFundsDialogCtrl.handleOpen}>
              Add funds
            </ButtonPlain>
          </div> */}
        </Card>
      )}

      {/* <AddFundsToAccountDialog
        dialogControl={addFundsDialogCtrl}
        accountId={category?.id ?? forCategory.id}
      /> */}
    </>
  );
};

export default CategoryMainCard;
