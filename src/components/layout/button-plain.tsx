import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import clsx from "clsx";
import { LinearProgress } from "@mui/material";

type Props = {
  loading?: boolean;
  children: React.ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const ButtonPlain: React.FC<Props> = ({
  loading,
  children,
  className,
  ...props
}) => {
  return (
    <button
      disabled={loading}
      {...props}
      className={clsx(
        "relative text-gray-600",
        loading && "opacity-50",
        className
      )}
    >
      {children}
      {loading && <LinearProgress className="absolute inset-x-0 bottom-0" />}
    </button>
  );
};

export default ButtonPlain;
