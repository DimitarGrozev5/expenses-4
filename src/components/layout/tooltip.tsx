import * as RadixTooltip from "@radix-ui/react-tooltip";

type Props = {
  label: string;
  side?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
};

const Tooltip: React.FC<Props> = ({ label, children, side = "bottom" }) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="rounded-md bg-gray-500 p-1 px-2 text-sm text-gray-50"
            sideOffset={5}
            side={side}
          >
            {label}
            <RadixTooltip.Arrow className="fill-gray-500" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default Tooltip;
