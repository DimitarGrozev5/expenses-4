import { type NextPage } from "next";

import AddIcon from "@mui/icons-material/Add";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

import Card from "~/components/layout/card";
import SpeedDial from "~/components/layout/speed-dial";
import { useDialog } from "~/components/layout/dialog";
import NewAccountDialog from "~/components/dialogs/new-account-dialog";
import { api } from "~/utils/api";
import { Skeleton } from "@mui/material";
import AccountMainCard from "~/components/specific/account-main-card";
import TransferFundsDialog from "~/components/dialogs/transfer-funds-dialog";
import AccountCurrAmountDialog from "~/components/dialogs/set-account-curr-amount";

const AccountsPage: NextPage = () => {
  const { data: accounts, isLoading, error } = api.accounts.getAll.useQuery();

  const newAccountDialogCtrl = useDialog();
  const transferFundsDialogCtrl = useDialog();
  const setCurrAmountDialogCtrl = useDialog();

  console.log(accounts);

  return (
    <>
      {isLoading && (
        <>
          <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />
          <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />
        </>
      )}

      {error && <Card>Can&apos;t load account data: {error.message}</Card>}

      {accounts && accounts.length === 0 && (
        <Card>No Accounts yet. Create one.</Card>
      )}

      {accounts &&
        accounts.length > 0 &&
        accounts.map((account) => (
          <AccountMainCard key={account.id} forAccount={account} />
        ))}

      <SpeedDial
        actions={[
          accounts && accounts.length > 0
            ? {
                label: "Update account amount",
                icon: <SystemUpdateAltIcon />,
                action: setCurrAmountDialogCtrl.handleOpen,
              }
            : null,

          accounts && accounts.length > 1
            ? {
                label: "Transfer funds",
                icon: <SwapHorizIcon />,
                action: transferFundsDialogCtrl.handleOpen,
              }
            : null,

          {
            label: "Add account",
            icon: <AddIcon />,
            action: newAccountDialogCtrl.handleOpen,
          },
        ]}
      />

      <NewAccountDialog dialogControl={newAccountDialogCtrl} />
      <TransferFundsDialog dialogControl={transferFundsDialogCtrl} />
      <AccountCurrAmountDialog dialogControl={setCurrAmountDialogCtrl} />
    </>
  );
};

export default AccountsPage;
