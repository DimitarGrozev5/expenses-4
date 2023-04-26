import AccountResults from "./account-results";
import AccountSelection from "./account-selection";
import SelectAccountSearchBar from "./search-bar";
import { useSelectAccount } from "./use-select-account";

type Props = {
  selectedAccount: string | null;
  onChange: (value: string | null) => void;
  label: string;
  error?: boolean;
  helperText?: string;
};

export const VerticalSelectAccount1: React.FC<Props> = ({
  selectedAccount,
  onChange,
  label,
  error = false,
  helperText = "",
}) => {
  const {
    searchString,
    setSearchString,
    accountResults,
    isLoading,
    error: searchError,
    selectAccount,
    value,
  } = useSelectAccount(selectedAccount, onChange);

  return (
    <div className="border-grey-300 flex flex-col gap-2 rounded-md border p-2">
      <SelectAccountSearchBar value={searchString} onChange={setSearchString} />

      <div className="min-h-[15vh] overflow-auto rounded-md border border-gray-300">
        <AccountResults
          accountResults={accountResults}
          isLoading={isLoading}
          error={searchError}
          selectAccount={selectAccount}
        />
      </div>

      <AccountSelection
        label={label}
        selectedAccount={value}
        allAccountResults={accountResults}
        selectAccount={selectAccount}
      />
      {error && <div className="text-red-500">{helperText}</div>}
    </div>
  );
};

export const VerticalSelectAccount2: React.FC<Props> = ({
  selectedAccount,
  onChange,
  label,
  error = false,
  helperText = "",
}) => {
  const {
    searchString,
    setSearchString,
    accountResults,
    isLoading,
    error: searchError,
    selectAccount,
    value,
  } = useSelectAccount(selectedAccount, onChange);

  return (
    <div className="border-grey-300 flex flex-col gap-2 rounded-md border p-2">
      {error && <div className="text-red-500">{helperText}</div>}
      <AccountSelection
        label={label}
        selectedAccount={value}
        allAccountResults={accountResults}
        selectAccount={selectAccount}
      />

      <SelectAccountSearchBar value={searchString} onChange={setSearchString} />

      <div className="min-h-[15vh] overflow-auto rounded-md border border-gray-300">
        <AccountResults
          accountResults={accountResults}
          isLoading={isLoading}
          error={searchError}
          selectAccount={selectAccount}
        />
      </div>
    </div>
  );
};
