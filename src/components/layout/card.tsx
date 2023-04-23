type Props = React.PropsWithChildren;

const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col rounded-md bg-gray-50 p-4 shadow-sm">
      {children}
    </div>
  );
};

export default Card;
