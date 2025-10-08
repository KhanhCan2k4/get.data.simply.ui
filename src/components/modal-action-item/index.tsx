import { useState } from "react";
import { CheckIcon, CloseIcon } from "../icon";

export type Action = {
  icon: React.ReactElement;
  title: string;
  onAccept?: () => void;
  onDeny?: () => void;
  onClick?: () => void;
};

type ModalActionItemProps = {
  action: Action;
};

export default function ModalActionItem({
  action: { icon, title, onAccept, onDeny, onClick },
}: ModalActionItemProps) {
  const [active, setActive] = useState(false);

  if (!onClick) {
    onClick = () => setActive((prev) => !prev);
  }
  return (
    <div
      className="flex flex-row gap-1 transition-all duration-500"
      onClick={onClick}
    >
      <div className="flex-1 bg-white py-2 px-4 text-sm rounded-full shadow-sm flex cursor-pointer items-center gap-4">
        <span className="flex-1">{title}</span>
        <span>{icon}</span>
      </div>
      <div
        className={`bg-red-50 rounded-full flex items-center justify-center cursor-pointer ${
          active ? "w-10" : "w-0 overflow-hidden"
        } h-10`}
      >
        <CloseIcon className="size-4 text-red-400" onClick={onDeny} />
      </div>
      <div
        className={`bg-green-50 rounded-full flex items-center justify-center cursor-pointer ${
          active ? "w-10" : "w-0 overflow-hidden"
        } h-10`}
      >
        <CheckIcon className="size-4 text-green-400" onClick={onAccept} />
      </div>
    </div>
  );
}
