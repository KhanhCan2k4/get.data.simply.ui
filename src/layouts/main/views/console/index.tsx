import { CloseIcon } from "@/components/icon";
import SqlEditor from "@/components/sql-editor";
import { DB } from "@/hooks/apis/use-dbs";
import { useEffect, useState } from "react";

type ConsoleProps = {
  db?: DB;
  onClose?: () => void;
};

export default function Console({ db, onClose }: ConsoleProps) {
  const [close, setClose] = useState(true);

  useEffect(() => setClose(!db), [db]);

  useEffect(() => {
    if (close && onClose) {
      onClose();
    }
  }, [close]);
  return (
    db && (
      <div className="z-10 resize-y overflow-auto w-full min-h-10 h-[300px] max-h-[500px] shadow-sm bg-white absolute bottom-0 left-0 right-0 [transform:scaleY(-1)]">
        <div className="[transform:scaleY(-1)] h-full">
          <CloseIcon
            className="size-6 absolute top-0 right-0 m-4 cursor-pointer"
            onClick={() => setClose(true)}
          />
          <div className="font-semibold border-b-2 border-b-gray-100 p-4">
            Console Of [{db.name}]
          </div>
          <SqlEditor />
        </div>
      </div>
    )
  );
}
