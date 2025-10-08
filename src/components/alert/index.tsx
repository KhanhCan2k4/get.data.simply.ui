import { CloseIcon } from "@/components/icon";
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

  const bg = `bg-${type}-500`;

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

  useEffect(handleClose, [target]);

  return (
    children && (
      <div
        ref={target}
        className={`flex top-0 left-0 w-full py-2 px-8 items-center shadow-sm text-green-700 text-shadow-2xs bg-green-700/45 gap-2 z-50 transition-all duration-100`}
      >
        <div className="flex-1">{children}</div>
        <CloseIcon
          className={`text-green-700 w-5 h-5 hover:scale-120`}
          onClick={() => {
            wait = 0;
            handleClose();
          }}
        />
      </div>
    )
  );
}
