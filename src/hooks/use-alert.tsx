import { AlertType } from "@/components/alert";
import { useEffect, useState } from "react";
import Alert from "@/components/alert";

export function useAlert() {
  const [alertMsg, setAlertMsg] = useState<React.ReactElement>();
  const [type, setType] = useState<AlertType>(AlertType.INFO);
  const [wait, setWait] = useState<number>();

  const setAlertOptions = (
    type?: AlertType,
    msg?: React.ReactElement,
    wait?: number
  ) => {
    setType(type ?? AlertType.INFO);
    setAlertMsg(msg);
    setWait(wait);
  };

  const alertElement = (
    <Alert type={type} wait={wait}>
      {alertMsg}
    </Alert>
  );

  return { alertElement, setAlertOptions };
}
