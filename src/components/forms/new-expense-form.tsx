import { type Control, Controller } from "react-hook-form";
import NumberInput from "../inputs/number-input";
import { z } from "zod";
import { VerticalSelectCategory1 } from "../inputs/select-category/vertical-select-cateogry";
import Spacer from "../layout/spacer";
import { VerticalSelectAccount2 } from "../inputs/select-account/vertical-select-account";
import SelectReasons from "../inputs/select-reasons";

export const NewExpenseSchema = z.object({
  createdOn: z.date(),
  categoryId: z.union([z.string(), z.null()]),
  fromAcountId: z.union([z.string(), z.null()]),
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
        name="amount"
        rules={{
          required: "Amount is required",
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
            label="Expense amount"
            helperText={error?.message}
            error={!!error}
          />
        )}
      />
      <Spacer gap={1} />

      <Controller
        control={formControl}
        name="categoryId"
        rules={{
          validate: (val) => {
            if (val === null) return "Please select a category";
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <VerticalSelectCategory1
            selectedCategory={value}
            onChange={onChange}
            label="For Category:"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Spacer gap={1} />

      <Controller
        control={formControl}
        name="fromAcountId"
        rules={{
          validate: (val) => {
            if (val === null) return "Please select an account";
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <VerticalSelectAccount2
            selectedAccount={value}
            onChange={onChange}
            label="From Account:"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Spacer gap={1} />

      <Controller
        control={formControl}
        name="reasons"
        rules={{
          validate: (val) => {
            if (val.length === 0) {
              return "Please enter at least one reason";
            }
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectReasons
            values={value}
            onChange={onChange}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </>
  );
};

export default NewExpenseForm;
