import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

type SqlEditorProps = {
  canType?: boolean;
  defaultSql?: string;
  onFinish?: (sql: string) => void;
};

const COMPLETE_INPUT_TIME = 1000;

export default function SqlEditor({
  canType = true,
  defaultSql = "",
  onFinish,
}: SqlEditorProps) {
  const [sql, setSql] = useState("");

  useEffect(() => setSql(defaultSql), [defaultSql]);

  useEffect(() => {
    if (!onFinish) return;
    const timeId = setTimeout(() => onFinish(sql), COMPLETE_INPUT_TIME);

    return () => {
      clearTimeout(timeId);
    };
  }, [sql]);

  return (
    <div className="w-full h-full overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="sql"
        value={sql}
        onChange={canType ? (value) => setSql(value || "") : undefined}
        theme="vs-dark"
        className="border-t-20 border-t-[#1e1e1e]"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          lineNumbers: "on",
        }}
      />
    </div>
  );
}
