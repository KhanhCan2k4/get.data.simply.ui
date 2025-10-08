import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import Key from "@/components/key";
import BadgeButton from "@/components/button";

export default function SqlEditor() {
  const [sql, setSql] = useState("SELECT * FROM users WHERE active = 1;");

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.altKey && ev.code === "KeyE") {
        ev.preventDefault();
        console.log("Execute!!");
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="flex gap-4">
        <div className="p-4 text-sm">
          Tips: using <Key name="Cmd/Ctrl" /> + <Key name="Opt/Alt" /> +{" "}
          <Key name="Key" /> to do the action rapily.
          <br />
          E.x: press <Key name="Cmd/Ctrl" /> + <Key name="Opt/Alt" /> +{" "}
          <Key name="E" /> to execute the sql statement.
        </div>
        <div className="p-4 flex-1 flex gap-2 flex-wrap content-start">
          <BadgeButton className="hover:bg-blue-400">Execute</BadgeButton>

          <BadgeButton className="hover:bg-gray-400">Clear</BadgeButton>

          <span className="w-1 h-100% bg-gray-100 rounded-2xl" />

          <BadgeButton className="hover:bg-purple-400">
            Select <span className="text-purple-200">*</span>
          </BadgeButton>

          <BadgeButton className="hover:bg-purple-600">Join</BadgeButton>

          <BadgeButton className="hover:bg-green-400">Insert</BadgeButton>

          <BadgeButton className="hover:bg-orange-400">Update</BadgeButton>

          <BadgeButton className="hover:bg-red-400">Delete</BadgeButton>

          <span className="w-1 h-100% bg-gray-100 rounded-2xl" />
          <span className="w-full" />

          <BadgeButton className="hover:bg-purple-600">
            Select limit
          </BadgeButton>

          <BadgeButton className="hover:bg-purple-600">Inner Join</BadgeButton>

          <BadgeButton className="hover:bg-purple-600">Left Join</BadgeButton>

          <span className="w-1 h-100% bg-gray-100 rounded-2xl" />

          <BadgeButton className="hover:bg-green-400">Create Table</BadgeButton>

          <BadgeButton className="hover:bg-orange-400">Alter Table</BadgeButton>

          <BadgeButton className="hover:bg-red-400">Drop Table</BadgeButton>

          <BadgeButton className="hover:bg-red-400">Truncate Table</BadgeButton>
        </div>
      </div>
      <Editor
        height="100%"
        defaultLanguage="sql"
        value={sql}
        onChange={(value) => setSql(value || "")}
        theme="vs-dark"
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
