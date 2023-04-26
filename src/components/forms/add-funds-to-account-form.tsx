import { type Control, Controller } from "react-hook-form";
import { z } from "zod";
import NumberInput from "../inputs/number-input";

export const AddFundsToAccountSchema = z.object({
  accountId: z.string(),
  amount: z.number(),
});

export type AddFundsToAccountFormData = z.infer<typeof AddFundsToAccountSchema>;

type Props = {
  formControl: Control<AddFundsToAccountFormData>;
};

const AddFundsToAccountForm: React.FC<Props> = ({ formControl }) => {
  return (
    <>
      <Controller
        control={formControl}
        name="amount"
        rules={{
          required: "Initial amount is required",
        }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <NumberInput
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            label="How much to add/subtract"
            helperText={error?.message}
            error={!!error}
          />
        )}
      />
    </>
  );
};

export default AddFundsToAccountForm;
