import { type Control, Controller } from "react-hook-form";
import NumberInput from "../inputs/number-input";
import TextInput from "../inputs/text-input";

export type NewAccountFormData = {
  name: string;
  initValue: number;
};

type Props = {
  formControl: Control<NewAccountFormData>;
};

const NewAccountForm: React.FC<Props> = ({ formControl }) => {
  return (
    <>
      <Controller
        control={formControl}
        name="name"
        rules={{ required: "Name is required" }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <TextInput
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            label="Account name"
            helperText={error?.message}
            error={!!error}
          />
        )}
      />
      <Controller
        control={formControl}
        name="initValue"
        rules={{
          required: "Initial amount is required",
          min: { value: 0, message: "Initial amount must be greater than 0" },
        }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <NumberInput
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            min={0}
            label="Account initial amount"
            helperText={error?.message}
            error={!!error}
          />
        )}
      />
    </>
  );
};

export default NewAccountForm;
