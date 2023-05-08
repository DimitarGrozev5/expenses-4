import clsx from "clsx";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label: string;
  error?: boolean;
  helperText?: string;
  endButtons?: React.ReactNode;
};

const TextInput: React.FC<Props> = ({
  value,
  onChange,
  onBlur = () => undefined,
  label,
  endButtons,
  error = false,
  helperText = "",
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-0.5">
        <span className={clsx("font-bold", error && "text-red-500")}>
          {label}
        </span>
        <span className={clsx(error && "text-red-500")}>{helperText}</span>
      </div>
      <div
        className={clsx(
          "relative flex justify-between rounded-md border border-gray-300",
          error && "border-red-500"
        )}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          type="text"
          className={"flex-1 rounded-md px-3 py-2"}
        />
        {endButtons && (
          <div className="absolute inset-y-0 right-0 flex items-center gap-2">
            {endButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
