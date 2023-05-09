import Card from "../../layout/card";
import { useDialog } from "../../layout/dialog";
import { api } from "~/utils/api";
import { Skeleton } from "@mui/material";
import { type BudgetCategoryWithExpenses } from "prisma/types";
import CategorySpent from "./category-spent";
import CategoryMonthlyOverview from "./category-monthly-overview";
import CategoryDailyOverview from "./caegory-daily-tracker";
import ButtonPlain from "~/components/layout/button-plain";
import NewExpenseDialog from "~/components/dialogs/new-expense-dialog";

type Props = {
  forCategory: BudgetCategoryWithExpenses;
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
  const addExpenseDialogCtrl = useDialog();

  return (
    <>
      {isLoading && <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />}
      {error && <Card className="text-red-500">{error.message}</Card>}

      {category && (
        <Card noPadding>
          <div className="bg-gray-500 py-1 text-center text-gray-100">
            {category.name}
          </div>

          {category.trackDaily && <CategoryDailyOverview category={category} />}

          <CategorySpent category={category} />
          <CategoryMonthlyOverview category={category} />

          <div className="flex justify-around bg-gray-300 px-4 py-2">
            <ButtonPlain onClick={addExpenseDialogCtrl.handleOpen}>
              Add Expense
            </ButtonPlain>
          </div>
        </Card>
      )}

      {category && (
        <NewExpenseDialog
          dialogControl={addExpenseDialogCtrl}
          categoryId={category.id}
        />
      )}
    </>
  );
};

export default CategoryMainCard;
