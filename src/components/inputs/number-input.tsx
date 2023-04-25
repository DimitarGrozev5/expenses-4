import { type ChangeEvent } from "react";
import clsx from "clsx";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Button from "../layout/button";

type Props = {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;

  step?: number;
  min?: number;
  max?: number;

  label: string;
  error?: boolean;
  helperText?: string;
};

const NumberInput: React.FC<Props> = ({
  value,
  onChange,
  onBlur = () => undefined,
  label,
  step = 1,
  min = -Infinity,
  max = Infinity,
  error = false,
  helperText = "",
}) => {
  const handleChangeByStep = (direction: -1 | 1) => () => {
    const oldValue = value ?? 0;
    const newValue = oldValue + direction * step;
    if (newValue < min || newValue > max) return;

    onChange(newValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < min || value > max) return;

    onChange(value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-0.5">
        <span className={clsx("font-bold", error && "text-red-500")}>
          {label}
        </span>
        <span className={clsx(error && "text-red-500")}>{helperText}</span>
      </div>
      <div className="flex justify-between gap-1">
        <Button
          onClick={handleChangeByStep(-1)}
          className={clsx("rounded-r-none bg-white", error && "border-red-500")}
        >
          <KeyboardArrowLeftIcon />
        </Button>

        <input
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          type="number"
          className={clsx(
            "flex-1 rounded-none border border-gray-300 px-3 py-2",
            error && "border-red-500"
          )}
        />

        <Button
          onClick={handleChangeByStep(1)}
          className={clsx("rounded-l-none bg-white", error && "border-red-500")}
        >
          <KeyboardArrowRightIcon />
        </Button>
      </div>
    </div>
  );
};

export default NumberInput;
