import BadgeButton from "@/components/button";
import { ConsoleIcon } from "@/components/icon";
import Modal from "@/components/modal";
import { Action } from "@/components/modal-action-item";
import { useShortcut } from "@/hooks/use-shortcut";
import { ReactNode, useState } from "react";
import "@/index.css";

type SqlShortcutProps = {
  text: React.JSX.Element | ReactNode | string;
  keys: string[];
  onRun: () => void;
  condition?: () => boolean;
};

export function SqlShortcut({
  title,
  text,
  keys,
  onRun,
  condition = () => true,
  children = undefined,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> &
  React.PropsWithChildren &
  SqlShortcutProps) {
  const [open, setOpen] = useState(false);
  const actions: Action[] = [
    {
      icon: <ConsoleIcon className="size-4" />,
      title: "Run",
      onClick: () => {
        setOpen(false);
        onRun();
      },
    },
  ];
  useShortcut(keys, onRun, condition);

  return (
    <>
      <BadgeButton {...props} onClick={children ? () => setOpen(true) : onRun}>
        {text}
      </BadgeButton>

      <Modal
        open={open}
        actions={children ? actions : []}
        onClose={() => setOpen(false)}
        className="top-2"
      >
        {children}
      </Modal>
    </>
  );
}
