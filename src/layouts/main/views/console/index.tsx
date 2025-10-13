import BadgeButton from "@/components/button";
import {
  AddIcon,
  CloseIcon,
  ConsoleIcon,
  LoadIcon,
  PlayIcon,
  TrashIcon,
} from "@/components/icon";
import Key from "@/components/key";
import SqlEditor from "@/components/sql-editor";
import { useShortcut } from "@/hooks/use-shortcut";
import { useConsole } from "@/providers/console";
import { SqlShortcut } from "./sql-shortcut";
import { ReactNode, useEffect, useState } from "react";
import { Parser } from "node-sql-parser";
import { useAlert } from "@/hooks/use-alert";
import { AlertType } from "@/components/alert";
import useIndexedDB from "@/hooks/use-indexed-db";
import Modal from "@/components/modal";
import { AddSqlShortcutForm } from "./sql-shortcut/add-shortcut-form";

const ALERT_WAIT_TIME = 10000;

const SHORT_CUT_STORE_KEY = "SHORT_CUT_STORE_KEY";

type ShortCut = {
  sql: string;
  text: string;
  keys: string[];
  className: string;
};

const DEFAULT_SQLS: ShortCut[] = [
  {
    sql: "SELECT * FROM <table>;",
    text: "Select *",
    keys: ["Ctrl", "Alt", "S"],
    className: "hover:bg-purple-400 h-fit",
  },
  {
    sql: "INSERT INTO <table> (<col 1>, <col 2>, ..., <col n>) VALUES (<value 1>, <value 2>, ..., <value n>);",
    text: "Insert",
    keys: ["Ctrl", "Alt", "I"],
    className: "hover:bg-blue-400 h-fit",
  },
  {
    sql: "UPDATE <table> SET <col 1> = <value 1>, <col 2> = <value 2>, ..., <col n> = <value n> WHERE <condition>;",
    text: "Update",
    keys: ["Ctrl", "Alt", "U"],
    className: "hover:bg-orange-400 h-fit",
  },
  {
    sql: "DELETE FROM <table> WHERE <condition>;",
    text: "Delete",
    keys: ["Ctrl", "Alt", "D"],
    className: "hover:bg-pink-400 h-fit",
  },
];

export default function Console() {
  const { isOpen, closeConsole, openConsole } = useConsole();
  const shortcutDAO = useIndexedDB<ShortCut>(SHORT_CUT_STORE_KEY);
  const [sql, setSql] = useState("");
  const { alertElement, setAlertOptions } = useAlert();
  const [addedKeyE, setAddedKeyE] = useState<ReactNode>();
  const [savedShortcuts, setSavedShortcuts] = useState<ShortCut[]>([]);

  const handleRunSql = () => {
    if (!sql) {
      setAlertOptions(
        <p className="p-2">Type your slq statement first!!</p>,
        AlertType.WARN
      );
      return;
    }

    const parser = new Parser();
    try {
      parser.astify(sql);

      setAlertOptions(
        <p className="flex gap-2 items-center p-2">
          <LoadIcon className="size-4 animate-spin" /> Running...
        </p>,
        AlertType.INFO,
        ALERT_WAIT_TIME
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAlertOptions(
          <p className="p-2">Invalid SQL: {err.message}</p>,
          AlertType.ERROR,
          ALERT_WAIT_TIME
        );
      } else {
        setAlertOptions(
          <p className="p-2">Invalid SQL: Unknown error while parsing SQL</p>,
          AlertType.ERROR
        );
      }
    }
  };

  const handleAddShortCut = (name: string, className: string) => {
    setAddedKeyE(undefined);

    setAlertOptions(
      <p className="p-2 flex flex-row items-center">
        <LoadIcon className="size-4 animate-spin" /> Adding key [{name}]...
      </p>,
      AlertType.INFO,
      ALERT_WAIT_TIME
    );

    shortcutDAO
      .create(
        {
          className,
          text: name,
          keys: [],
          sql,
        },
        name
      )
      .then((result) => {
        if (result) {
          setAlertOptions(
            <p className="p-2">Added key [{name}] already!!</p>,
            AlertType.SUCCESS
          );
        } else {
          setAlertOptions(
            <p className="p-2">Failed to add key [{name}]!!</p>,
            AlertType.ERROR
          );
        }
      })
      .catch(() => {
        setAlertOptions(
          <p className="p-2">Failed to add key [{name}]!!</p>,
          AlertType.ERROR
        );
      });
  };

  useShortcut(["Ctrl", "Alt", "ArrowUp"], openConsole);
  useShortcut(["Ctrl", "Alt", "ArrowDown"], closeConsole);

  useEffect(() => {
    shortcutDAO
      .findAll()
      .then((vs) => setSavedShortcuts(vs.map((v) => v._data)));
  }, [shortcutDAO]);

  return (
    isOpen && (
      <div className="z-10 resize-y overflow-auto w-full min-h-10 h-[500px] max-h-[500px] shadow-sm bg-white absolute bottom-0 left-0 right-0 [transform:scaleY(-1)]">
        <div className="[transform:scaleY(-1)] h-full">
          <CloseIcon
            className="size-6 absolute top-0 right-0 m-4 cursor-pointer"
            onClick={closeConsole}
          />
          <div className="border-b-2 border-b-gray-100 p-4">
            <span className="font-semibold flex gap-2">
              <ConsoleIcon /> SQL CONSOLE
            </span>
            <div className="p-2 text-sm">
              Tips: using <Key name="Ctrl" /> + <Key name="Opt/Alt" /> +{" "}
              <Key name="Key" /> to do the action rapily.
              <br />
              E.x: press <Key name="Ctrl" /> + <Key name="Opt/Alt" /> +{" "}
              <Key name="E" /> to execute the sql statement.
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-4 flex-1 flex gap-2 flex-wrap content-start">
              <SqlShortcut
                text={<PlayIcon className="size-4" />}
                keys={["Ctrl", "Alt", "E"]}
                onRun={handleRunSql}
                condition={() => isOpen}
                className="hover:bg-pink-800 h-fit"
              >
                <p className="bg-white p-4 rounded-xl shadow-sm relative">
                  Run the current sql statement.
                  <br />
                  You can use <Key name="Ctrl" /> + <Key name="Opt/Alt" /> +{" "}
                  <Key name="E" /> to do this action as well
                </p>
              </SqlShortcut>

              <SqlShortcut
                text={<TrashIcon className="size-4" />}
                keys={["Ctrl", "Alt", "C"]}
                onRun={() => setSql("")}
                condition={() => isOpen}
                className="hover:bg-red-400 h-fit"
              >
                <p className="bg-white p-4 rounded-xl shadow-sm relative">
                  Empty console.
                  <br />
                  You can use <Key name="Ctrl" /> + <Key name="Opt/Alt" /> +{" "}
                  <Key name="C" /> to do this action as well
                </p>
              </SqlShortcut>

              <SqlShortcut
                text={<AddIcon className="size-4" />}
                keys={["Ctrl", "Alt", "N"]}
                onRun={
                  !sql
                    ? () => {}
                    : () =>
                        setAddedKeyE(
                          <AddSqlShortcutForm
                            onFinish={handleAddShortCut}
                            sql={sql}
                          />
                        )
                }
                condition={() => isOpen}
                className="hover:bg-blue-400 h-fit"
              />

              <span className="w-2 bg-gray-100 rounded-2xl mx-2" />

              {DEFAULT_SQLS.map((item) => (
                <SqlShortcut
                  key={item.text}
                  onRun={() => setSql(item.sql)}
                  condition={() => isOpen}
                  {...item}
                />
              ))}

              <span className="w-2 bg-gray-100 rounded-2xl mx-2" />
              <div className="flex-1 flex gap-2 flex-wrap">
                {savedShortcuts.map((item) => (
                  <SqlShortcut
                    key={item.text}
                    onRun={() => setSql(item.sql)}
                    condition={() => isOpen}
                    {...item}
                  />
                ))}
              </div>
            </div>
          </div>
          {alertElement}
          <SqlEditor defaultSql={sql} onFinish={setSql} />

          <Modal open={!!addedKeyE} onClose={() => setAddedKeyE(undefined)}>
            {addedKeyE}
          </Modal>
        </div>
      </div>
    )
  );
}
