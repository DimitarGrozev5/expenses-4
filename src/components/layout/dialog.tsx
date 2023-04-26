import * as RadixDialog from "@radix-ui/react-dialog";

import ClearIcon from "@mui/icons-material/Clear";
import { useCallback, useMemo, useState } from "react";

export type DialogControl = {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
};

type Props = {
  control: DialogControl;
  title: string;
  description?: string;
  buttons: React.ReactNode;
  children: React.ReactNode;
};

const Dialog: React.FC<Props> = ({
  control,
  title,
  description,
  buttons,
  children,
}) => {
  const handleOpenChange = (state: boolean) =>
    !state ? control.handleClose() : control.handleOpen();

  return (
    <RadixDialog.Root open={control.open} onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm" />
        <RadixDialog.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[95vh] flex-col items-stretch overflow-auto rounded-t-lg bg-gray-50 p-4 pt-9">
          <RadixDialog.Title className="absolute left-4 top-3 text-lg font-bold">
            {title}
          </RadixDialog.Title>
          {description && (
            <RadixDialog.Description className="text-md mb-4">
              {description}
            </RadixDialog.Description>
          )}
          <div className="flex flex-1 flex-col">{children}</div>
          <div className="mt-6 flex justify-end">{buttons}</div>
          <RadixDialog.Close asChild className="absolute right-3 top-3 z-50">
            <button className="IconButton" aria-label="Close">
              <ClearIcon />
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default Dialog;

export const useDialog = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return useMemo(
    () => ({ open, handleOpen, handleClose }),
    [handleClose, handleOpen, open]
  );
};
