import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";

type AccountId = string;

export const useSelectAccount = (
  value: AccountId | null,
  onChange: (value: AccountId | null) => void
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
    data: accountResults,
    isLoading,
    error,
  } = api.account.findByName.useQuery(deferedSearchString, { initialData: [] });

  const selectAccount = useCallback(
    (accountId: AccountId | null) => {
      onChange(accountId);
    },
    [onChange]
  );

  return useMemo(
    () => ({
      value,
      searchString,
      setSearchString,
      accountResults,
      isLoading,
      error,
      selectAccount,
    }),
    [accountResults, error, isLoading, searchString, selectAccount, value]
  );
};
