import { type Control, Controller } from "react-hook-form";
import NumberInput from "../inputs/number-input";
import { z } from "zod";
import Spacer from "../layout/spacer";
import { VerticalSelectAccount1 } from "../inputs/select-account/vertical-select-account";
import { api } from "~/utils/api";

export const AccountCurrentAmountSchema = z.object({
  accountId: z.union([z.string(), z.null()]),
  amount: z.number(),
});

export type AccountCurrentAmountFormData = z.infer<
  typeof AccountCurrentAmountSchema
>;

type Props = {
  formControl: Control<AccountCurrentAmountFormData>;
  hideAccountIdForm?: boolean;
  accountId?: string | null;
};

const AccountCurrentAmountForm: React.FC<Props> = ({
  formControl,
  hideAccountIdForm,
  accountId,
}) => {
  const { data: account } = api.accounts.getById.useQuery(accountId || "", {
    enabled: !!accountId,
  });
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

      {hideAccountIdForm ? (
        <div className="font-bold">For account: {account?.name || "..."}</div>
      ) : (
        <Controller
          control={formControl}
          name="accountId"
          rules={{
            validate: (val) => {
              if (val === null) return "Please select a category";
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <VerticalSelectAccount1
              selectedAccount={value}
              onChange={onChange}
              label="For Account:"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}
      <Spacer gap={1} />
    </>
  );
};

export default AccountCurrentAmountForm;
