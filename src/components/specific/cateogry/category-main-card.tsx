import Card from "../../layout/card";
import { useDialog } from "../../layout/dialog";
import { api } from "~/utils/api";
import { Skeleton } from "@mui/material";
import { type BudgetCategoryWithExpenses } from "prisma/types";
import CategorySpent from "./category-spent";
import CategoryMonthlyOverview from "./category-monthly-overview";
import CategoryDailyOverview from "./caegory-daily-tracker";

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
  // const addFundsDialogCtrl = useDialog();

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
