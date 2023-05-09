import { useEffect } from "react";
import type { DialogControl } from "../layout/dialog";
import Dialog from "../layout/dialog";
import { useForm } from "react-hook-form";
import ButtonPlain from "../layout/button-plain";
import { api } from "~/utils/api";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import NewCategoryForm, {
  type NewCategoryFormData,
} from "../forms/new-category-form";

type Props = { dialogControl: DialogControl };

const NewCategoryDialog: React.FC<Props> = ({ dialogControl }) => {
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<NewCategoryFormData>({
    defaultValues: {
      name: "",
      montlyInput: 0,
      initAmount: 0,
      trackDaily: false,
      trackMonthly: true,
    },
  });

  const {
    mutate: addCategory,
    isLoading: addingCategory,
    isSuccess: addedCategory,
    error,
  } = api.categories.addCategory.useMutation();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (addedCategory) {
      const invalidationKeys = getQueryKey(api.categories.getAll);
      void queryClient.invalidateQueries(invalidationKeys);

      dialogControl.handleClose();
      resetForm();
    }
  }, [addedCategory, dialogControl, queryClient, resetForm]);

  const submitHandler = handleSubmit((data: NewCategoryFormData) => {
    addCategory(data);
  });

  return (
    <Dialog
      control={dialogControl}
      title="Add category"
      description="Set the properties of the new category. The monthly amount is the amount that will be added to the account every month. The Initial Amount is the money you will alocate from your main Expense Account to the new Budget Category"
      buttons={
        <ButtonPlain
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={submitHandler}
          loading={addingCategory}
        >
          Add new category
        </ButtonPlain>
      }
    >
      <NewCategoryForm formControl={control} />

      {error && <p className="text-red-500">{error.message}</p>}
    </Dialog>
  );
};

export default NewCategoryDialog;
