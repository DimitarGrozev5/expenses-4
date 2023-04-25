import clsx from "clsx";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label: string;
  error?: boolean;
  helperText?: string;
};

const TextInput: React.FC<Props> = ({
  value,
  onChange,
  onBlur = () => undefined,
  label,
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
      <div className="flex justify-between">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          type="text"
          className={clsx(
            "flex-1 rounded-md border border-gray-300 px-3 py-2",
            error && "border-red-500"
          )}
        />
      </div>
    </div>
  );
};

export default TextInput;
