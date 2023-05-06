import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";

type CategoryId = string;

export const useSelectCategory = (
  value: CategoryId | null,
  onChange: (value: CategoryId | null) => void
) => {
  const [searchString, setSearchString] = useState("");

  const [deferedSearchString, setDeferedSearchString] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferedSearchString(searchString);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchString]);

  const {
    data: categoryResults,
    isLoading,
    error,
  } = api.categories.findByName.useQuery(deferedSearchString, {
    initialData: [],
  });

  const selectCategory = useCallback(
    (categoryId: CategoryId | null) => {
      onChange(categoryId);
    },
    [onChange]
  );

  return useMemo(
    () => ({
      value,
      searchString,
      setSearchString,
      categoryResults,
      isLoading,
      error,
      selectCategory,
    }),
    [categoryResults, error, isLoading, searchString, selectCategory, value]
  );
};
