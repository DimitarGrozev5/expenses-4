import { useMemo } from "react";
import { type ExpenseAccount } from "@prisma/client";

import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  label: string;
  selectedAccount: string | null;
  selectAccount: (accountId: string | null) => void;
  allAccountResults: ExpenseAccount[];
};

const AccountSelection: React.FC<Props> = ({
  label,
  selectedAccount,
  allAccountResults,
  selectAccount,
}) => {
  const account = useMemo(
    () => allAccountResults.find((a) => a.id === selectedAccount) ?? null,
    [selectedAccount, allAccountResults]
  );
  return (
    <div className="flex flex-col">
      <h2 className="font-bold">{label}</h2>
      {account ? (
        <div className="flex justify-between gap-2">
          <h2 className="flex-[3] font-bold">{account.name}</h2>
          <h2 className="flex-[2]">{(+account.initAmount).toFixed(2)}</h2>
          <h2 className="flex-[1]">{(+account.credit).toFixed(2)}</h2>
          <button onClick={() => selectAccount(null)}>
            <ClearIcon />
          </button>
        </div>
      ) : (
        <h2>No account selected</h2>
      )}
    </div>
  );
};

export default AccountSelection;
