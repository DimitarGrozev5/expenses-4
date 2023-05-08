import { Skeleton } from "@mui/material";
import { type ExpenseWithReasons } from "~/server/api/routers/expenses";
import { api } from "~/utils/api";
import Card from "../layout/card";

type Props = {
  forExpense: ExpenseWithReasons;
};

const ExpenseMainCard: React.FC<Props> = ({ forExpense: forExpense }) => {
  // Fetch data
  const {
    data: expense,
    isLoading,
    error,
  } = api.expenses.getById.useQuery(forExpense.id, {
    initialData: forExpense,
  });

  // Setup modal controls
  // const addFundsDialogCtrl = useDialog();

  return (
    <>
      {isLoading && <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />}
      {error && <Card className="text-red-500">{error.message}</Card>}

      {expense && (
        <Card noPadding>
          <div className="flex bg-gray-300 px-4 py-1 text-center text-gray-700">
            {new Intl.DateTimeFormat("bg-BG", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            }).format(expense.createdOn)}
            <div className="flex-1">
              <span className="font-bold">{(+expense.amount).toFixed(2)}</span>{" "}
              from <span className="font-bold">{expense.category.name}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center bg-gray-300 px-4 py-2">
            {expense.reasons.map((reason) => (
              <div
                key={reason.id}
                className="rounded-full border border-gray-400 px-3 py-1 bg-gray-200"
              >
                {reason.reason.tag}
              </div>
            ))}
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

export default ExpenseMainCard;
