import { useEffect, useState } from "react";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import TextInput from "./text-input";
import { api } from "~/utils/api";
import Button from "../layout/button";

type Props = {
  values: string[];
  onChange: (values: string[]) => void;
  error?: boolean;
  helperText?: string;
};

const SelectReasons: React.FC<Props> = ({
  values,
  onChange,
  error = false,
  helperText = "",
}) => {
  const [searchText, setSearchText] = useState("");
  const [defSearch, setDefSearch] = useState("");
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (searchText.length > 2) {
      timeout = setTimeout(() => {
        setDefSearch(searchText);
      }, 200);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [searchText]);

  const { data: matchingReasons } = api.reasons.findByTag.useQuery(defSearch, {
    enabled: searchText.length > 2,
  });

  const handleAddTag = (tag: string) => () => {
    if (values.includes(tag)) return;

    onChange([...values, tag]);
  };

  const handleRemoveTag = (tag: string) => () => {
    onChange(values.filter((v) => v !== tag));
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {error && <div className="text-red-500">{helperText}</div>}

      <div className="flex flex-wrap items-center gap-4">
        <div>Selected reasons:</div>
        {values.map((value) => (
          <button
            key={value}
            onClick={handleRemoveTag(value)}
            className="rounded-full border border-gray-300 px-4 py-2"
          >
            {value}
          </button>
        ))}
      </div>

      <TextInput
        value={searchText}
        onChange={setSearchText}
        label="Search tag"
        endButtons={
          searchText.length > 0 && (
            <>
              <Button plain onClick={handleAddTag(searchText)}>
                <CheckIcon />
              </Button>
              <Button plain onClick={() => setSearchText("")}>
                <ClearIcon />
              </Button>
            </>
          )
        }
      />

      <div className="flex flex-wrap gap-4">
        {searchText.length > 2 &&
          matchingReasons &&
          matchingReasons.length > 0 &&
          matchingReasons.map((reason) => (
            <button
              key={reason.id}
              onClick={handleAddTag(reason.tag)}
              className="rounded-full border border-gray-300 px-4 py-2"
            >
              {reason.tag}
            </button>
          ))}

        {searchText.length > 2 &&
          matchingReasons &&
          matchingReasons.length === 0 && <div>No matching reasons</div>}
      </div>
    </div>
  );
};

export default SelectReasons;
