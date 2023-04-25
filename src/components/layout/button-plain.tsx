import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import clsx from "clsx";

type Props = {
  fullWidth?: boolean;
  children: React.ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const ButtonPlain: React.FC<Props> = ({
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "text-gray-600",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
};

export default ButtonPlain;
