import { type NextPage } from "next";
import Head from "next/head";

import AddIcon from "@mui/icons-material/Add";

import { useDialog } from "~/components/layout/dialog";
import SpeedDial from "~/components/layout/speed-dial";
import NewCategoryDialog from "~/components/dialogs/new-category-dialog";

const BudgetPage: NextPage = () => {
  const newCategoryDialogCtrl = useDialog();
  return (
    <>
      <Head>
        <title>Budget</title>
      </Head>
      Budget
      <SpeedDial
        actions={[
          {
            label: "Add category",
            icon: <AddIcon />,
            action: newCategoryDialogCtrl.handleOpen,
          },
        ]}
      />
      <NewCategoryDialog dialogControl={newCategoryDialogCtrl} />
    </>
  );
};

export default BudgetPage;
