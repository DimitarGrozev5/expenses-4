import { useEffect } from "react";
import type { DialogControl } from "../layout/dialog";
import NewAccountForm from "../forms/new-account-form";
import Dialog from "../layout/dialog";
import { useForm } from "react-hook-form";
import ButtonPlain from "../layout/button-plain";
import { api } from "~/utils/api";
import type { NewAccountFormData } from "../forms/new-account-form.types";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";

type Props = { dialogControl: DialogControl };

const NewAccountDialog: React.FC<Props> = ({ dialogControl }) => {
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<NewAccountFormData>({
    defaultValues: { name: "", initValue: 0 },
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

  const submitHandler = handleSubmit((data: NewAccountFormData) => {
    addAccount(data);
  });

  return (
    <Dialog
      control={dialogControl}
      title="Add account"
      description="Set a name and a starting value for your new account."
      buttons={
        <ButtonPlain
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={submitHandler}
          loading={addingAccount}
        >
          Add new account
        </ButtonPlain>
      }
    >
      <NewAccountForm formControl={control} />

      {error && <p className="text-red-500">{error.message}</p>}
    </Dialog>
  );
};

export default NewAccountDialog;
