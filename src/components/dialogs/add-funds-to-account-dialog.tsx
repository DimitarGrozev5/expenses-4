import { useEffect } from "react";
import type { DialogControl } from "../layout/dialog";
import Dialog from "../layout/dialog";
import { useForm } from "react-hook-form";
import ButtonPlain from "../layout/button-plain";
import { api } from "~/utils/api";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import AddFundsToAccountForm, {
  type AddFundsToAccountFormData,
} from "../forms/add-funds-to-account-form";

type Props = { dialogControl: DialogControl; accountId: string };

const AddFundsToAccountDialog: React.FC<Props> = ({
  dialogControl,
  accountId,
}) => {
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<AddFundsToAccountFormData>({
    defaultValues: { accountId, amount: 0 },
  });

  const {
    mutate: addFunds,
    isLoading: addingFunds,
    isSuccess: addedFunds,
    error,
    reset: resetMutationState,
  } = api.account.addFundsToAccount.useMutation();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (addedFunds) {
      const invalidationKeys1 = getQueryKey(api.account.getAll);
      const invalidationKeys2 = getQueryKey(api.account.getById, accountId);
      void queryClient.invalidateQueries(invalidationKeys1);
      void queryClient.invalidateQueries(invalidationKeys2);

      dialogControl.handleClose();
      resetForm();
      resetMutationState();
    }
  }, [
    accountId,
    addedFunds,
    dialogControl,
    queryClient,
    resetForm,
    resetMutationState,
  ]);

  const submitHandler = handleSubmit((data: AddFundsToAccountFormData) => {
    addFunds(data);
  });

  return (
    <Dialog
      control={dialogControl}
      title="Add funds to account"
      description="How much did you add to your account? A positive value means you added funds. A negative value means you withdrew funds."
      buttons={
        <ButtonPlain
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={submitHandler}
          loading={addingFunds}
        >
          Add funds
        </ButtonPlain>
      }
    >
      <AddFundsToAccountForm formControl={control} />

      {error && <p className="text-red-500">{error.message}</p>}
    </Dialog>
  );
};

export default AddFundsToAccountDialog;
