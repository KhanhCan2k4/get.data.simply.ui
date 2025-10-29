import BadgeButton from "@/components/button";
import { ConsoleIcon } from "@/components/icon";
import Modal from "@/components/modal";
import { Action } from "@/components/modal-action-item";
import { useShortcut } from "@/hooks/use-shortcut";
import { ReactNode, useMemo, useState } from "react";
import "@/index.css";
import { useModal } from "@/providers/modal";

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
  const { setIsModalOpen, setModalChildren, setModalActions } = useModal();

  const handleOpen = () => {
    if (children) {
      setModalChildren && setModalChildren(children);

      setModalActions &&
        setModalActions([
          {
            icon: <ConsoleIcon className="size-4" />,
            title: "Run",
            onClick: () => {
              setIsModalOpen(false);
              onRun();
            },
          },
        ]);

      setIsModalOpen(true);
    } else {
      onRun();
    }
  };
  
  useShortcut(keys, onRun, condition);

  return (
    <BadgeButton {...props} onClick={handleOpen}>
      {text}
    </BadgeButton>
  );
}
