import { useEffect } from "react";
import type { DialogControl } from "../layout/dialog";
import Dialog from "../layout/dialog";
import { useForm } from "react-hook-form";
import ButtonPlain from "../layout/button-plain";
import { api } from "~/utils/api";
import type { NewAccountFormData } from "../forms/new-account-form.types";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import TransferFundsForm, {
  type TransferFundsFormData,
} from "../forms/transfer-funds-form";

type Props = { dialogControl: DialogControl };

const TransferFundsDialog: React.FC<Props> = ({ dialogControl }) => {
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<TransferFundsFormData>({
    defaultValues: { fromAccountId: null, toAccountId: null, amount: 0 },
  });

  const {
    mutate: addAccount,
    isLoading: addingAccount,
    isSuccess: addedAccount,
    error,
  } = api.account.addAccount.useMutation();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (addedAccount) {
      const invalidationKeys = getQueryKey(api.account.getAll);
      void queryClient.invalidateQueries(invalidationKeys);

      dialogControl.handleClose();
      resetForm();
    }
  }, [addedAccount, dialogControl, queryClient, resetForm]);

  const submitHandler = handleSubmit((data: TransferFundsFormData) => {
    // addAccount(data);
  });

  return (
    <Dialog
      control={dialogControl}
      title="Transfer funds"
      description="Select accounts and set the amount to transfer"
      buttons={
        <ButtonPlain
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={submitHandler}
          loading={addingAccount}
        >
          Transfer amount
        </ButtonPlain>
      }
    >
      <TransferFundsForm formControl={control} />

      {error && <p className="text-red-500">{error.message}</p>}
    </Dialog>
  );
};

export default TransferFundsDialog;
