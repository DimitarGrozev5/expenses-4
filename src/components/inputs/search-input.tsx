import clsx from "clsx";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label: string;
  error?: boolean;
  helperText?: string;
};

const SearchInput: React.FC<Props> = ({
  value,
  onChange,
  onBlur = () => undefined,
  label,
  error = false,
  helperText = "",
}) => {
  const clearTextHandler = () => onChange("");
  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-0.5">
        <span className={clsx("font-bold", error && "text-red-500")}>
          {label}
        </span>
        <span className={clsx(error && "text-red-500")}>{helperText}</span>
      </div>
      <div className="relative flex justify-between">
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
        {value.length > 0 && (
          <button
            onClick={clearTextHandler}
            className={clsx("absolute inset-y-0 right-2 border-none")}
          >
            <ClearIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
