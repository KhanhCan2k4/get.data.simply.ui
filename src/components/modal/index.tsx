import { useEffect, useState } from "react";
import ModalActionItem, { Action } from "@/components/modal-action-item";
type ModalProps = {
  actions?: Action[];
  open: boolean;
  onClose?: () => void;
};

export default function Modal({
  children,
  open,
  onClose,
  actions = [],
}: ModalProps & React.PropsWithChildren) {
  const [close, setClose] = useState(true);

  useEffect(() => setClose(!open), [open]);

  useEffect(() => {
    if (close && onClose) {
      onClose();
    }
  }, [close]);

  return (
    !close && (
      <section className="fixed inset-0">
        <div
          className="absolute inset-0 bg-gray-900 opacity-40 z-20"
          onClick={() => setClose(true)}
        />
        <div className="absolute top-1/5 left-1/2 -translate-x-1/2 z-30">
          {children}
          <div className="mt-4 flex flex-col gap-2 w-full">
            {actions.map((action, index) => (
              <ModalActionItem action={action} key={index} />
            ))}
          </div>
        </div>
      </section>
    )
  );
}
