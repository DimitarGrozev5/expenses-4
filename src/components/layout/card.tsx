import clsx from "clsx";

type Props = {
  noPadding?: boolean;
  className?: HTMLDivElement["className"];
} & React.PropsWithChildren;

const Card: React.FC<Props> = ({ noPadding, children, className = "" }) => {
  return (
    <div
      className={clsx(
        "relative flex flex-col overflow-hidden rounded-md bg-gray-50 shadow-sm",
        className,
        !noPadding && "p-4"
      )}
    >
      {children}
    </div>
  );
};

export default Card;
