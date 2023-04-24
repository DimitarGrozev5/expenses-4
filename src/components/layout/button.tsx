import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import clsx from "clsx";

type Props = {
  fullWidth?: boolean;
  children: React.ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: React.FC<Props> = ({
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-md border border-gray-500 bg-gray-300 px-4 py-2 text-gray-800",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
