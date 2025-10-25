import { useEffect, useRef, useState } from "react";
import ModalActionItem, { Action } from "@/components/modal-action-item";
import { useModal } from "@/providers/modal";

const DELAY_OPEN_TIME = 200;

type ModalProps = {
  actions?: Action[];
  open: boolean;
  wait?: number;
  onClose?: () => void;
};

export default function Modal({
  children,
  open,
  wait = DELAY_OPEN_TIME,
  onClose,
  actions = [],
  ...props
}: ModalProps &
  React.PropsWithChildren &
  React.HTMLAttributes<HTMLDivElement>) {
  const target = useRef<HTMLDivElement>(null);
  const [close, setClose] = useState(true);
  const { setIsModalOpen } = useModal();

  useEffect(() => {
    setClose(!open);

    const timeId = setTimeout(() => {
      if (!target.current) return;
      target.current.style.opacity = "1";
    }, wait);

    return () => {
      clearTimeout(timeId);
    };
  }, [open]);

  useEffect(() => {
    if (close && onClose) {
      onClose();
    }

    setIsModalOpen(!close);
  }, [close]);

  return (
    !close && (
      <div
        className="fixed inset-0 opacity-0 transition-opacity duration-100 !z-20"
        ref={target}
      >
        <div
          className="absolute inset-0 bg-gray-900 opacity-40 z-20"
          onClick={() => setClose(true)}
        />
        <div
          {...props}
          className={`absolute top-10 left-1/2 -translate-x-1/2 z-30 ${props.className}`}
        >
          {children}
          <div className="mt-4 flex flex-col gap-2 border-1 border-blue-200 p-2 rounded-2xl">
            {actions.map((action, index) => (
              <ModalActionItem action={action} key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  );
}
