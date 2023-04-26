type Props = {
  gap: number;
};

const Spacer: React.FC<Props> = ({ gap }) => {
  return <div style={{ height: `${gap}rem` }} />;
};

export default Spacer;
