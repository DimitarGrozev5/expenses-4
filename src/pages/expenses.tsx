import { type NextPage } from "next";
import Head from "next/head";

import AddIcon from "@mui/icons-material/Add";

import { useDialog } from "~/components/layout/dialog";
import SpeedDial from "~/components/layout/speed-dial";
import NewExpenseDialog from "~/components/dialogs/new-expense-dialog";
import { api } from "~/utils/api";
import { Skeleton } from "@mui/material";
import Card from "~/components/layout/card";
import ExpenseMainCard from "~/components/specific/expense-main-card";

const ExpensesPage: NextPage = () => {
  const newExpenseDialogCtrl = useDialog();

  const { data: expenses, isLoading, error } = api.expenses.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Expenses</title>
      </Head>

      {isLoading && (
        <>
          <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />
          <Skeleton height={150} sx={{ transform: "scale(1,1)" }} />
        </>
      )}

      {error && <Card>Can&apos;t load expenses data</Card>}

      {expenses && expenses.length === 0 && <Card>No Expenses yet</Card>}

      {expenses &&
        expenses.length > 0 &&
        expenses.map((expense) => (
          <ExpenseMainCard key={expense.id} forExpense={expense} />
        ))}

      <SpeedDial
        actions={[
          {
            label: "Add expense",
            icon: <AddIcon />,
            action: newExpenseDialogCtrl.handleOpen,
          },
        ]}
      />

      <NewExpenseDialog dialogControl={newExpenseDialogCtrl} />
    </>
  );
};

export default ExpensesPage;
