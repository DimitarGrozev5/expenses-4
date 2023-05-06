import SearchInput from "../search-input";

type Props = { value: string; onChange: (value: string) => void };

const SelectCategorySearchBar: React.FC<Props> = ({ value, onChange }) => {
  return <SearchInput value={value} onChange={onChange} label="Search" />;
};

export default SelectCategorySearchBar;
