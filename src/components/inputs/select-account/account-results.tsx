import { CircularProgress } from "@mui/material";
import { type ExpenseAccount } from "@prisma/client";

type Props = {
  accountResults: ExpenseAccount[];
  selectAccount: (accountId: string | null) => void;
  isLoading: boolean;
  error: { message: string } | null;
};

const AccountResults: React.FC<Props> = ({
  accountResults,
  selectAccount,
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

      {accountResults.length === 0 && !isLoading && <li>No results</li>}

      {accountResults.length > 0 &&
        accountResults.map((account) => (
          <li
            key={account.id}
            className="flex rounded-md border border-gray-300"
          >
            <button
              className="flex flex-1 items-center justify-between px-3 py-1"
              onClick={() => selectAccount(account.id)}
            >
              <h2 className="flex-[3] text-left font-bold">{account.name}</h2>
              <h2 className="flex-[2]">{(+account.initAmount).toFixed(2)}</h2>
              <h2 className="flex-[1] text-xs">
                {(+account.credit).toFixed(2)}
              </h2>
            </button>
          </li>
        ))}
    </ul>
  );
};

export default AccountResults;
