import { type NextPage } from "next";
import AddIcon from "@mui/icons-material/Add";

import Card from "~/components/layout/card";
import SpeedDial from "~/components/layout/speed-dial";
import { useDialog } from "~/components/layout/dialog";
import NewAccountDialog from "~/components/dialogs/new-account-dialog";
import { api } from "~/utils/api";
import { Skeleton } from "@mui/material";
import AccountMainCard from "~/components/specific/account-main-card";

const AccountsPage: NextPage = () => {
  const { data: accounts, isLoading, error } = api.account.getAll.useQuery();

  const newAccountDialogCtrl = useDialog();

  return (
    <>
      {isLoading && (
        <>
          <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />
          <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />
        </>
      )}

      {error && <Card>Can&apos;t load account data</Card>}

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
