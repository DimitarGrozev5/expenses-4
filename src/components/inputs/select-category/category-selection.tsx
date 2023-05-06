import { useMemo } from "react";
import { type BudgetCategory } from "@prisma/client";

import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  label: string;
  selectedCategory: string | null;
  selectCategory: (accountId: string | null) => void;
  allCategoriesResults: BudgetCategory[];
};

const CategorySelection: React.FC<Props> = ({
  label,
  selectedCategory,
  allCategoriesResults,
  selectCategory,
}) => {
  const category = useMemo(
    () => allCategoriesResults.find((a) => a.id === selectedCategory) ?? null,
    [selectedCategory, allCategoriesResults]
  );
  return (
    <div className="flex flex-col">
      <h2 className="font-bold">{label}</h2>
      {category ? (
        <div className="flex justify-between gap-2">
          <h2 className="flex-[3] font-bold">{category.name}</h2>
          <h2 className="flex-[2]">{(+category.montlyInput).toFixed(2)}</h2>
          <button onClick={() => selectCategory(null)}>
            <ClearIcon />
          </button>
        </div>
      ) : (
        <h2>No category selected</h2>
      )}
    </div>
  );
};

export default CategorySelection;
