import { type NextPage } from "next";
import Head from "next/head";

import AddIcon from "@mui/icons-material/Add";

import { useDialog } from "~/components/layout/dialog";
import SpeedDial from "~/components/layout/speed-dial";
import NewExpenseDialog from "~/components/dialogs/new-expense-dialog";

const ExpensesPage: NextPage = () => {
  const newЕьпенсеDialogCtrl = useDialog();

  return (
    <>
      <Head>
        <title>Expenses</title>
      </Head>

      {/* {isLoading && (
        <>
          <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />
          <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />
        </>
      )}

      {error && <Card>Can&apos;t load category data</Card>}

      {categories && categories.length === 0 && (
        <Card>No Categories yet. Create one.</Card>
      )}

      {categories &&
        categories.length > 0 &&
        categories.map((category) => (
          <CategoryMainCard key={category.id} forCategory={category} />
        ))} */}

      <SpeedDial
        actions={[
          {
            label: "Add expense",
            icon: <AddIcon />,
            action: newЕьпенсеDialogCtrl.handleOpen,
          },
        ]}
      />

      <NewExpenseDialog dialogControl={newЕьпенсеDialogCtrl} />
    </>
  );
};

export default ExpensesPage;
