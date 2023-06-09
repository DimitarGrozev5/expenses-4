import { useEffect } from "react";
import type { DialogControl } from "../layout/dialog";
import Dialog from "../layout/dialog";
import { useForm } from "react-hook-form";
import ButtonPlain from "../layout/button-plain";
import { api } from "~/utils/api";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import NewExpenseForm, {
  type NewExpenseFormData,
} from "../forms/new-expense-form";

type Props = { dialogControl: DialogControl; categoryId?: string | null };

const NewExpenseDialog: React.FC<Props> = ({
  dialogControl,
  categoryId = null,
}) => {
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<NewExpenseFormData>({
    defaultValues: {
      createdOn: new Date(),
      fromAcountId: null,
      categoryId,
      amount: 0,
      reasons: [],
    },
  });

  const {
    mutate: addExpense,
    isLoading: addingExpense,
    isSuccess: addedExpense,
    error,
    reset: resetMutation,
  } = api.expenses.addExpense.useMutation();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (addedExpense) {
      const invalidationKeys1 = getQueryKey(api.expenses.getAll);
      const invalidationKeys2 = getQueryKey(api.categories.getAll);
      const invalidationKeys3 = getQueryKey(
        api.categories.getById,
        categoryId ?? ""
      );
      const invalidationKeys4 = getQueryKey(api.accounts.getAll);
      void queryClient.invalidateQueries(invalidationKeys1);
      void queryClient.invalidateQueries(invalidationKeys2);
      void queryClient.invalidateQueries(invalidationKeys3);
      void queryClient.invalidateQueries(invalidationKeys4);

      dialogControl.handleClose();
      resetForm();
      resetMutation();
    }
  }, [
    addedExpense,
    categoryId,
    dialogControl,
    queryClient,
    resetForm,
    resetMutation,
  ]);

  const submitHandler = handleSubmit((data: NewExpenseFormData) => {
    addExpense(data);
  });

  return (
    <Dialog
      control={dialogControl}
      title="Add expense"
      description=""
      buttons={
        <ButtonPlain
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={submitHandler}
          loading={addingExpense}
        >
          Add new expense
        </ButtonPlain>
      }
    >
      <NewExpenseForm
        formControl={control}
        hideCategoryIdForm={!!categoryId}
        categoryId={categoryId}
      />

      {error && <p className="text-red-500">{error.message}</p>}
    </Dialog>
  );
};

export default NewExpenseDialog;
