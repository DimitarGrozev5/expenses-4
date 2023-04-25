import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  actions : {
    label: string;
    icon: React.ReactElement;
    action: () => void;
  }[];
};

const SpeedDial: React.FC<Props> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => () => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-8">
        {isOpen &&
          actions.map((action) => (
            <div
              key={action.label}
              className="flex items-center justify-end gap-4"
            >
              <div className="rounded-md border-gray-300 bg-gray-200 px-2 py-1 text-gray-800">
                {action.label}
              </div>
              <button
                className="mr-2 h-12 w-12 rounded-full border border-gray-300 bg-gray-200 text-gray-800"
                onClick={handleAction(action.action)}
              >
                {action.icon}
              </button>
            </div>
          ))}
        <div>
          <button
            className={
              "h-16 w-16 rounded-full border border-gray-600 bg-gray-500 text-gray-50"
            }
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ClearIcon /> : <AddIcon />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SpeedDial;
