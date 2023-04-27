import { type Control, Controller } from "react-hook-form";
import NumberInput from "../inputs/number-input";
import TextInput from "../inputs/text-input";
import { z } from "zod";

export const NewCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  montlyInput: z
    .number()
    .gte(0, "Montly input must be greater than or equal to 0"),
  initAmount: z
    .number()
    .gte(0, "Initial amount must be greater than or equal to 0"),
});

export type NewCategoryFormData = z.infer<typeof NewCategorySchema>;

type Props = {
  formControl: Control<NewCategoryFormData>;
};

const NewCategoryForm: React.FC<Props> = ({ formControl }) => {
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
    </>
  );
};

export default NewCategoryForm;
