import { type Control, Controller } from "react-hook-form";
import NumberInput from "../inputs/number-input";
import TextInput from "../inputs/text-input";
import { z } from "zod";
import Switch from "../inputs/switch";

export const NewExpenseSchema = z.object({
  createdOn: z.date(),
  categoryId: z.string(),
  fromAcountId: z.string(),
  amount: z.number(),
  reasons: z.array(z.string()),
});

export type NewExpenseFormData = z.infer<typeof NewExpenseSchema>;

type Props = {
  formControl: Control<NewExpenseFormData>;
};

const NewExpenseForm: React.FC<Props> = ({ formControl }) => {
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
            label="Category name"
            helperText={error?.message}
            error={!!error}
          />
        )}
      />
      <Controller
        control={formControl}
        name="montlyInput"
        rules={{
          required: "Monthly input is required",
          min: {
            value: 0,
            message: "Monthly input must be greater than or equal to 0",
          },
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
            label="Monthly input"
            helperText={error?.message}
            error={!!error}
          />
        )}
      />
      <Controller
        control={formControl}
        name="initAmount"
        rules={{
          required: "Initial amount is required",
          min: {
            value: 0,
            message: "Initial amount must be greater than or equal to 0",
          },
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
            label="Initial amount"
            helperText={error?.message}
            error={!!error}
          />
        )}
      />

      <Controller
        control={formControl}
        name="trackDaily"
        render={({ field: { value, onChange } }) => (
          <Switch
            label="Track daily expenses"
            checked={value}
            onChange={onChange}
          />
        )}
      />
    </>
  );
};

export default NewExpenseForm;
