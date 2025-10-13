import { AlertType } from "@/components/alert";
import { useState } from "react";
import Alert from "@/components/alert";

export function useAlert() {
  const [alert, setAlert] = useState<React.ReactElement>();

  const setAlertOptions = (
    msg?: React.ReactElement,
    type?: AlertType,
    wait?: number
  ) => {
    setAlert(
      <Alert
        key={new Date().getTime()}
        type={type ?? AlertType.INFO}
        wait={wait}
      >
        {msg}
      </Alert>
    );
  };

  const forceClose = () => {
    setAlert(undefined);
  };

  return { alertElement: alert, setAlertOptions, forceClose };
}
