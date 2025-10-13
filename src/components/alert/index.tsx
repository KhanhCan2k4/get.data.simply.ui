import { CloseIcon } from "@/components/icon";
import { useShortcut } from "@/hooks/use-shortcut";
import { useEffect, useRef } from "react";

export enum AlertType {
  SUCCESS = "green",
  ERROR = "red",
  WARN = "yellow",
  INFO = "blue",
}

const DEFAULT_WAIT_TIME = 2000;

type AlertProps = {
  type: AlertType;
  wait?: number;
};

export default function Alert({
  type = AlertType.INFO,
  wait = DEFAULT_WAIT_TIME,
  children = undefined,
}: AlertProps & React.PropsWithChildren) {
  const target = useRef<HTMLDivElement>(null);

  let bg;
  let textColor;
  switch (type) {
    case AlertType.SUCCESS:
      bg = `bg-green-700/45`;
      textColor = `text-green-700`;
      break;
    case AlertType.ERROR:
      bg = `bg-red-700/45`;
      textColor = `text-red-700`;
      break;
    case AlertType.WARN:
      bg = `bg-yellow-700/45`;
      textColor = `text-yellow-700`;
      break;
    case AlertType.INFO:
      bg = `bg-blue-700/45`;
      textColor = `text-blue-700`;
      break;
  }

  const handleClose = () => {
    const moveTimeId = setTimeout(() => {
      if (!target.current) return;

      target.current.style.transform = "translate(0,-100%)";
    }, wait);

    const hideTimeId = setTimeout(() => {
      if (!target.current) return;

      target.current.style.display = "none";
    }, wait + 100);

    return () => {
      clearTimeout(moveTimeId);
      clearTimeout(hideTimeId);
    };
  };

  const handleForceClose = () => {
    wait = 0;
    handleClose();
  };

  useEffect(handleClose, [target]);

  useShortcut(["Ctrl", "Alt", "KeyX"], handleForceClose);

  return (
    children && (
      <div
        ref={target}
        className={`flex top-0 left-0 w-full py-2 px-8 items-center shadow-sm ${textColor} text-shadow-2xs ${bg} gap-2 z-50 transition-all duration-100`}
      >
        <div className="flex-1">{children}</div>
        <CloseIcon
          className={`${textColor} w-5 h-5 hover:scale-120`}
          onClick={handleForceClose}
        />
      </div>
    )
  );
}
