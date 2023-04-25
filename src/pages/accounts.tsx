import { type ExpenseAccount, Prisma } from "@prisma/client";
import clsx from "clsx";
import { type NextPage } from "next";
import AddIcon from "@mui/icons-material/Add";

import Card from "~/components/layout/card";
import SpeedDial from "~/components/layout/speed-dial";
import { useDialog } from "~/components/layout/dialog";
import NewAccountDialog from "~/components/dialogs/new-account-dialog";

// Utility fn that calculates flex-grow prop for initAmount
const initFlex = (acc: ExpenseAccount) => {
  const flexVal = Math.round(
    (acc.initAmount.toNumber() / Math.abs(acc.credit.toNumber())) * 100
  );

  return Math.max(1, flexVal);
};

// Utility fn that calculates flex-grow prop for credit
const creditFlex = (acc: ExpenseAccount) => {
  const flexVal = Math.round(
    (Math.abs(acc.credit.toNumber()) / acc.initAmount.toNumber()) * 100
  );

  return Math.max(1, flexVal);
};

const AccountsPage: NextPage = () => {
  const accounts: ExpenseAccount[] = [
    {
      id: "1",
      name: "ДСК",
      accountOrder: 1,
      initAmount: new Prisma.Decimal(650),
      credit: new Prisma.Decimal(-400),
      userId: "1",
    },
  ];

  const newAccountDialogCtrl = useDialog();

  return (
    <>
      {accounts.map((account) => (
        <Card key={account.id} noPadding>
          <div className="bg-gray-500 py-1 text-center text-gray-100">
            {account.name}
          </div>

          <div className="flex">
            <div
              className={clsx(
                "flex flex-col items-center px-1 py-1",
                `flex-[${initFlex(account)}]`
              )}
            >
              <span className="text-md">{account.initAmount.toFixed(2)}лв</span>
              <span className="text-xs">Свободни</span>
            </div>
            <div
              className={clsx(
                "flex flex-col items-center px-1 py-1",
                `flex-[${creditFlex(account)}]`,
                account.credit.toNumber() <= 0
                  ? "bg-green-200 text-green-900"
                  : "bg-red-300 text-red-900"
              )}
            >
              <span className="text-md">
                {Math.abs(account.credit.toNumber()).toFixed(2)}лв
              </span>
              <span className="text-xs">Кредит</span>
            </div>
          </div>

          <div
            className={clsx(
              "flex flex-col items-center py-1",
              account.credit.toNumber() <= 0
                ? "bg-green-100 text-green-900"
                : "bg-red-100 text-red-900"
            )}
          >
            <span className="text-md">
              {Math.abs(
                account.initAmount.toNumber() - account.credit.toNumber()
              ).toFixed(2)}
              лв
            </span>
            <span className="text-xs">Трябва да има</span>
          </div>
          <div className="py-2text-gray-100 flex justify-between bg-gray-500 px-4 py-1">
            <button>test</button>
          </div>
        </Card>
      ))}

      <SpeedDial
        actions={[
          {
            label: "Add account",
            icon: <AddIcon />,
            action: newAccountDialogCtrl.handleOpen,
          },
        ]}
      />

      <NewAccountDialog dialogControl={newAccountDialogCtrl} />
    </>
  );
};

export default AccountsPage;
