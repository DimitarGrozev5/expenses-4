import { useEffect } from "react";
import type { DialogControl } from "../layout/dialog";
import Dialog from "../layout/dialog";
import { useForm } from "react-hook-form";
import ButtonPlain from "../layout/button-plain";
import { api } from "~/utils/api";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import AccountCurrentAmountForm, {
  type AccountCurrentAmountFormData,
} from "../forms/set-account-curr-amount";

type Props = { dialogControl: DialogControl; accountId?: string | null };

const AccountCurrAmountDialog: React.FC<Props> = ({
  dialogControl,
  accountId = null,
}) => {
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<AccountCurrentAmountFormData>({
    defaultValues: {
      accountId,
      amount: 0,
    },
  });

  const {
    mutate: setAmount,
    isLoading: settingAmount,
    isSuccess: mutationSuccess,
    error,
    reset: resetMutation,
  } = api.accounts.setCurrentAmount.useMutation();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (mutationSuccess) {
      const invalidationKeys1 = getQueryKey(api.accounts.getAll);
      const invalidationKeys2 = getQueryKey(
        api.accounts.getById,
        accountId ?? ""
      );
      void queryClient.invalidateQueries(invalidationKeys1);
      void queryClient.invalidateQueries(invalidationKeys2);

      dialogControl.handleClose();
      resetForm();
      resetMutation();
    }
  }, [
    mutationSuccess,
    dialogControl,
    queryClient,
    resetForm,
    resetMutation,
    accountId,
  ]);

  const submitHandler = handleSubmit((data: AccountCurrentAmountFormData) => {
    setAmount(data);
  });

  return (
    <Dialog
      control={dialogControl}
      title="Add expense"
      description="Set the amount that is actually in the account"
      buttons={
        <ButtonPlain
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={submitHandler}
          loading={settingAmount}
        >
          Update account amount
        </ButtonPlain>
      }
    >
      <AccountCurrentAmountForm
        formControl={control}
        hideAccountIdForm={!!accountId}
        accountId={accountId}
      />

      {error && <p className="text-red-500">{error.message}</p>}
    </Dialog>
  );
};

export default AccountCurrAmountDialog;
