import { useEffect } from "react";
import type { DialogControl } from "../layout/dialog";
import Dialog from "../layout/dialog";
import { useForm } from "react-hook-form";
import ButtonPlain from "../layout/button-plain";
import { api } from "~/utils/api";
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
    watch,
  } = useForm<TransferFundsFormData>({
    defaultValues: { fromAccountId: null, toAccountId: null, amount: 0 },
  });

  const {
    mutate: transferFunds,
    isLoading: transferingFunds,
    isSuccess: transferedFunds,
    error,
    reset: resetMutation,
  } = api.accounts.transferFunds.useMutation();

  const queryClient = useQueryClient();

  const fromAccountId = watch("fromAccountId") ?? undefined;
  const toAccountId = watch("toAccountId") ?? undefined;

  useEffect(() => {
    if (transferedFunds) {
      const invalidationKeys1 = getQueryKey(api.accounts.getAll);
      const invalidationKeys2 = getQueryKey(api.accounts.getById, fromAccountId);
      const invalidationKeys3 = getQueryKey(api.accounts.getById, toAccountId);

      void queryClient.invalidateQueries(invalidationKeys1);
      void queryClient.invalidateQueries(invalidationKeys2);
      void queryClient.invalidateQueries(invalidationKeys3);

      dialogControl.handleClose();
      resetForm();
      resetMutation();
    }
  }, [
    transferedFunds,
    dialogControl,
    queryClient,
    resetForm,
    resetMutation,
    fromAccountId,
    toAccountId,
  ]);

  const submitHandler = handleSubmit((data: TransferFundsFormData) => {
    transferFunds(data);
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
          loading={transferingFunds}
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
