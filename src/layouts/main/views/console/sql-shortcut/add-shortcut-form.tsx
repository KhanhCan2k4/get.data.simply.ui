import BadgeButton from "@/components/button";
import { AddIcon } from "@/components/icon";
import { useState } from "react";

type AddSqlShortcutFormProps = {
  sql: string;
  onFinish: (name: string, className: string) => void;
};

export function AddSqlShortcutForm({ sql, onFinish }: AddSqlShortcutFormProps) {
  const [inputKeyName, setInputKeyName] = useState("");
  const [inputClassName, setInputClassName] = useState("");

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2">
      <input
        type="text"
        value={inputKeyName}
        onChange={(e) => setInputKeyName(e.target.value)}
        className="outline-0 p-2"
        placeholder="Display name..."
      />

      <input
        type="text"
        value={inputClassName}
        onChange={(e) => setInputClassName(e.target.value)}
        className="outline-0 p-2"
        placeholder="Class name..."
      />

      <input
        type="text"
        value={sql}
        className="outline-0 py-2 bg-gray-50 rounded-2xl px-4"
        readOnly
      />

      <div className="flex gap-2 items-center justify-center">
        <BadgeButton className={inputClassName}>
          {inputKeyName ? (
            inputKeyName
          ) : (
            <span className="text-gray-400">Display name...</span>
          )}
        </BadgeButton>
        <BadgeButton onClick={() => onFinish(inputKeyName, inputClassName)}>
          <AddIcon className="size-4" />
        </BadgeButton>
      </div>
    </div>
  );
}
