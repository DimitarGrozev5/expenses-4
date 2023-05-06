import CategoryResults from "./category-results";
import CategorySelection from "./category-selection";
import SelectCategorySearchBar from "./category-search-bar";
import { useSelectCategory } from "./use-select-category";

type Props = {
  selectedCategory: string | null;
  onChange: (value: string | null) => void;
  label: string;
  error?: boolean;
  helperText?: string;
};

export const VerticalSelectCategory1: React.FC<Props> = ({
  selectedCategory,
  onChange,
  label,
  error = false,
  helperText = "",
}) => {
  const {
    searchString,
    setSearchString,
    categoryResults,
    isLoading,
    error: searchError,
    selectCategory,
    value,
  } = useSelectCategory(selectedCategory, onChange);

  return (
    <div className="border-grey-300 flex flex-col gap-2 rounded-md border p-2">
      <CategorySelection
        label={label}
        selectedCategory={value}
        allCategoriesResults={categoryResults}
        selectCategory={selectCategory}
      />
      {error && <div className="text-red-500">{helperText}</div>}

      <SelectCategorySearchBar
        value={searchString}
        onChange={setSearchString}
      />

      <div className="min-h-[15vh] overflow-auto rounded-md border border-gray-300">
        <CategoryResults
          categoryResults={categoryResults}
          isLoading={isLoading}
          error={searchError}
          selectCategory={selectCategory}
        />
      </div>
    </div>
  );
};
