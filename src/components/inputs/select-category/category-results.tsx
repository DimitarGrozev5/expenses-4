import { CircularProgress } from "@mui/material";
import { type BudgetCategory } from "@prisma/client";

type Props = {
  categoryResults: BudgetCategory[];
  selectCategory: (accountId: string | null) => void;
  isLoading: boolean;
  error: { message: string } | null;
};

const CategoryResults: React.FC<Props> = ({
  categoryResults,
  selectCategory,
  isLoading,
  error,
}) => {
  return (
    <ul className="relative flex flex-col gap-2 p-2">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black opacity-20">
          <CircularProgress />
        </div>
      )}

      {error && <li>{error.message}</li>}

      {categoryResults.length === 0 && !isLoading && <li>No results</li>}

      {categoryResults.length > 0 &&
        categoryResults.map((category) => (
          <li
            key={category.id}
            className="flex rounded-md border border-gray-300"
          >
            <button
              className="flex flex-1 items-center justify-between px-3 py-1"
              onClick={() => selectCategory(category.id)}
            >
              <h2 className="flex-[3] text-left font-bold">{category.name}</h2>
              <h2 className="flex-[2]">{(+category.montlyInput).toFixed(2)}</h2>
            </button>
          </li>
        ))}
    </ul>
  );
};

export default CategoryResults;
