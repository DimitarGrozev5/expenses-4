import { type Control, Controller } from "react-hook-form";
import { z } from "zod";
import NumberInput from "../inputs/number-input";
import {
  VerticalSelectAccount1,
  VerticalSelectAccount2,
} from "../inputs/select-account/vertical-select-account";
import Spacer from "../layout/spacer";

export const TransferFundsSchema = z.object({
  fromAccountId: z.union([z.string(), z.null()]),
  toAccountId: z.union([z.string(), z.null()]),
  amount: z.number(),
});

export type TransferFundsFormData = z.infer<typeof TransferFundsSchema>;

type Props = {
  formControl: Control<TransferFundsFormData>;
};

const TransferFundsForm: React.FC<Props> = ({ formControl }) => {
  return (
    <>
      <Controller
        control={formControl}
        name="fromAccountId"
        rules={{
          validate: (val, ctx) => {
            if (val === null) return "Please select an account";
            if (val === ctx.toAccountId)
              return "From and To accounts must be different";
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <VerticalSelectAccount1
            selectedAccount={value}
            onChange={onChange}
            label="From Account:"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Spacer gap={1} />

      <div className="rounded-md border border-gray-300 p-2">
        <Controller
          control={formControl}
          name="amount"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <NumberInput
              label="Amount"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </div>
      <Spacer gap={1} />

      <Controller
        control={formControl}
        name="toAccountId"
        rules={{
          validate: (val, ctx) => {
            if (val === null) return "Please select an account";
            if (val === ctx.fromAccountId)
              return "From and To accounts must be different";
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <VerticalSelectAccount2
            selectedAccount={value}
            onChange={onChange}
            label="To Account:"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </>
  );
};

export default TransferFundsForm;
