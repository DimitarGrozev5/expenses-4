import * as RadixSwitch from "@radix-ui/react-switch";

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const Switch: React.FC<Props> = ({ label, checked, onChange }) => (
  <form>
    <div className="my-2 flex items-center gap-4">
      <label className="font-bold" htmlFor="airplane-mode">
        {label}
      </label>
      <RadixSwitch.Root
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-[29px] w-[46px] cursor-default rounded-full border-2 border-gray-400 bg-gray-100 outline-none data-[state=checked]:bg-gray-400"
        id="airplane-mode"
      >
        <RadixSwitch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-gray-500 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-gray-700" />
      </RadixSwitch.Root>
    </div>
  </form>
);

export default Switch;
