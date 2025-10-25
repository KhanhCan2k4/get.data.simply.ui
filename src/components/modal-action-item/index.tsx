import { useState } from "react";
import { CheckIcon, CloseIcon } from "../icon";
import { useModal } from "@/providers/modal";

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
  const { setIsModalOpen } = useModal();

  const handleClick = () => {
    if (!onClick) {
      setActive((prev) => !prev);
    } else {
      onClick();
      setIsModalOpen(false);
    }
  };

  const handleAccept = () => {
    onAccept && onAccept();
    setIsModalOpen(false);
  };

  const handleDeny = () => {
    onDeny && onDeny();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-row gap-1 transition-all duration-500">
      <div
        onClick={handleClick}
        className="bg-white py-2 px-4 text-sm rounded-full shadow-sm flex cursor-pointer items-center gap-2 hover:translate-x-3"
      >
        <span className="flex-1">{title}</span>
        <span>{icon}</span>
      </div>
      <div
        className={`ml-3 bg-red-50 rounded-full flex items-center justify-center cursor-pointer ${
          active ? "w-10" : "w-0 overflow-hidden"
        } h-10`}
      >
        <CloseIcon className="size-4 text-red-400" onClick={handleAccept} />
      </div>
      <div
        className={`bg-green-50 rounded-full flex items-center justify-center cursor-pointer ${
          active ? "w-10" : "w-0 overflow-hidden"
        } h-10`}
      >
        <CheckIcon className="size-4 text-green-400" onClick={handleDeny} />
      </div>
    </div>
  );
}
