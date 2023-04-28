import { type NextPage } from "next";
import Head from "next/head";

import AddIcon from "@mui/icons-material/Add";

import { useDialog } from "~/components/layout/dialog";
import SpeedDial from "~/components/layout/speed-dial";
import NewCategoryDialog from "~/components/dialogs/new-category-dialog";
import { api } from "~/utils/api";
import { Skeleton } from "@mui/material";
import Card from "~/components/layout/card";
import CategoryMainCard from "~/components/specific/cateogry/category-main-card";

const BudgetPage: NextPage = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = api.categories.getAll.useQuery();

  const newCategoryDialogCtrl = useDialog();

  return (
    <>
      <Head>
        <title>Budget</title>
      </Head>

      {isLoading && (
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
        ))}

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
