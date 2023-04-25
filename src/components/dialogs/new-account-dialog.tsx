import type { DialogControl } from "../layout/dialog";
import NewAccountForm, {
  type NewAccountFormData,
} from "../forms/new-account-form";
import Dialog from "../layout/dialog";
import { useForm } from "react-hook-form";
import ButtonPlain from "../layout/button-plain";

type Props = { dialogControl: DialogControl };

const NewAccountDialog: React.FC<Props> = ({ dialogControl }) => {
  const { control, handleSubmit } = useForm<NewAccountFormData>({
    defaultValues: { name: "", initValue: 0 },
  });

  const submitHandler = handleSubmit((data: NewAccountFormData) => {
    console.log(data);
  });

  return (
    <Dialog
      control={dialogControl}
      title="Add account"
      description="За да добавите нов акаунт, дайте му име и задайте каква сума има в него"
      buttons={
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <ButtonPlain className="Button green" onClick={submitHandler}>
          Save changes
        </ButtonPlain>
      }
    >
      <NewAccountForm formControl={control} />
    </Dialog>
  );
};

export default NewAccountDialog;
