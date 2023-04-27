import { type ExpenseAccount } from "@prisma/client";
import Card from "../layout/card";
import clsx from "clsx";
import ButtonPlain from "../layout/button-plain";
import { useDialog } from "../layout/dialog";
import AddFundsToAccountDialog from "../dialogs/add-funds-to-account-dialog";
import { api } from "~/utils/api";
import { Skeleton } from "@mui/material";

type Props = {
  forAccount: ExpenseAccount;
};

// Utility fn that calculates flex-grow prop for initAmount
const initFlex = (acc: ExpenseAccount) => {
  const flexVal = Math.round(
    (+acc.initAmount / (Math.abs(+acc.credit) || 1)) * 100
  );

  return Math.max(1, flexVal);
};

// Utility fn that calculates flex-grow prop for credit
const creditFlex = (acc: ExpenseAccount) => {
  const flexVal = Math.round(
    (Math.abs(+acc.credit) / (+acc.initAmount || 1)) * 100
  );

  return Math.max(1, flexVal);
};

const AccountMainCard: React.FC<Props> = ({ forAccount }) => {
  // Fetch data
  const {
    data: account,
    isLoading,
    error,
  } = api.accounts.getById.useQuery(forAccount.id, {
    initialData: forAccount,
  });

  // Setup modal controls
  const addFundsDialogCtrl = useDialog();

  return (
    <>
      {isLoading && <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />}
      {error && <Card className="text-red-500">{error.message}</Card>}

      {account && (
        <Card noPadding>
          <div className="bg-gray-500 py-1 text-center text-gray-100">
            {account.name}
          </div>

          <div className="flex">
            <div
              className={clsx("flex flex-col items-center px-1 py-1")}
              style={{ flex: initFlex(account) }}
            >
              <span className="text-md">
                {(+account.initAmount).toFixed(2)}лв
              </span>
              <span className="text-xs">Free funds</span>
            </div>
            <div
              className={clsx(
                "flex flex-col items-center px-1 py-1",
                +account.credit <= 0
                  ? "bg-green-200 text-green-900"
                  : "bg-red-300 text-red-900"
              )}
              style={{ flex: creditFlex(account) }}
            >
              <span className="text-md">
                {Math.abs(+account.credit).toFixed(2)}лв
              </span>
              <span className="text-xs">Credit</span>
            </div>
          </div>

          <div
            className={clsx(
              "flex flex-col items-center py-1",
              +account.credit <= 0
                ? "bg-green-100 text-green-900"
                : "bg-red-100 text-red-900"
            )}
          >
            <span className="text-md">
              {Math.abs(+account.initAmount - +account.credit).toFixed(2)}
              лв
            </span>
            <span className="text-xs">Should have</span>
          </div>
          <div className="flex justify-around bg-gray-300 px-4 py-2">
            <ButtonPlain onClick={addFundsDialogCtrl.handleOpen}>
              Add funds
            </ButtonPlain>
          </div>
        </Card>
      )}

      <AddFundsToAccountDialog
        dialogControl={addFundsDialogCtrl}
        accountId={account?.id ?? forAccount.id}
      />
    </>
  );
};

export default AccountMainCard;
