import BadgeButton from "@/components/button";
import { AddIcon } from "@/components/icon";
import { useState } from "react";

type AddSqlShortcutFormProps = {
  sql: string;
  onFinish: (name: string) => void;
};

export function AddSqlShortcutForm({ sql, onFinish }: AddSqlShortcutFormProps) {
  const [inputKeyName, setInputKeyName] = useState("");

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2 text-sm">
      <div className="flex gap-2 items-center">
        <label className="w-50">Display name:</label>
        <input
          type="text"
          value={inputKeyName}
          onChange={(e) => setInputKeyName(e.target.value)}
          className="outline-0 p-2 rounded"
          placeholder="Display name..."
        />
      </div>

      <textarea
        className="outline-0 py-2 bg-gray-50 rounded-2xl px-4"
        readOnly
        rows={3}
        defaultValue={sql}
      />

      <div className="flex gap-2 items-center justify-center mt-2">
        <BadgeButton>
          {inputKeyName ? (
            inputKeyName
          ) : (
            <span className="text-gray-400">Display name...</span>
          )}
        </BadgeButton>
        <BadgeButton onClick={() => onFinish(inputKeyName)}>
          <AddIcon className="size-4" />
        </BadgeButton>
      </div>
    </div>
  );
}
