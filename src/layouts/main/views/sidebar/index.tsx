import { useEffect, useRef, useState } from "react";
import { DB, useDBs } from "@/hooks/apis/use-dbs";
import DBSideBarItem from "@/layouts/main/views/db-sidebar-item";
import { Receiver, useReceivers } from "@/hooks/apis/use-receivers";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constants/routes";
import MsgSideBarItem from "@/layouts/main/views/msg-sidebar-item";
import SearchInput from "@/components/search-input";
import DBSideBarItemSkeleton from "@/layouts/main/views/db-sidebar-item/skeleton";
import MsgSideBarItemSkeleton from "../msg-sidebar-item/skeleton";
import Modal from "@/components/modal";
import { Action } from "@/components/modal-action-item";
import {
  AddIcon,
  CodeIcon,
  ConsoleIcon,
  DownFileIcon,
  TrashIcon,
} from "@/components/icon";

const SKELETON_DB_ITEMS_QUANTITY = 10;
const SKELETON_MSG_ITEMS_QUANTITY = 10;

type SideBarProps = {
  onOpenConsole?: (db: DB) => void;
};

export default function SideBar({ onOpenConsole }: SideBarProps) {
  const navigate = useNavigate();
  const target = useRef<HTMLDivElement>(null);
  const [selectedE, setSelectedE] = useState<React.JSX.Element>();
  const [modalActions, setModalActions] = useState<Action[]>([]);
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const { getAllDBs } = useDBs();
  const { getAllReceivers } = useReceivers();
  let tab: "DB" | "MSG" | undefined = undefined;
  const createDBPath = ROUTERS.DATABASE_CREATE.path;
  const createApiPath = ROUTERS.DATABASE_API_CREATE.path;

  const handleSearch = (keyword: string) => {};

  const handleForceOpen = () => {
    setOpen(true);
    if (target.current) {
      target.current.style.width = "auto";
    }
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    tab: "DB" | "MSG" | undefined,
    data: DB | Receiver
  ) => {
    e.preventDefault();
    switch (tab) {
      case "DB":
        const db = data as DB;
        setSelectedE(
          <DBSideBarItem
            key={db.id}
            db={db}
            open
            onClick={undefined}
            style={{ scale: 1.1, width: 400, justifyContent: "start" }}
          />
        );

        setModalActions([
          {
            icon: <TrashIcon className="size-4 text-red-500" />,
            title: "Drop Database",
            onAccept: alert,
          },
          {
            icon: <DownFileIcon className="size-4 text-purple-500" />,
            title: "Export Database",
            onClick: alert,
          },
          {
            icon: <ConsoleIcon className="size-4 text-black-500" />,
            title: "Open Console",
            onClick: () => {
              setSelectedE(undefined);
              onOpenConsole && onOpenConsole(db);
            },
          },
          {
            icon: <CodeIcon className="size-4 text-yellow-500" />,
            title: "Create API",
            onClick: () => {
              setSelectedE(undefined);
              navigate(createApiPath.replace(":database", db.name));
            },
          },
        ]);
        break;
      case "MSG":
        const receiver = data as Receiver;
        setSelectedE(
          <MsgSideBarItem
            key={receiver.id}
            receiver={receiver}
            open
            onClick={undefined}
            style={{ scale: 1.1, width: 400 }}
          />
        );

        setModalActions([
          {
            icon: <TrashIcon className="size-4 text-red-500" />,
            title: "Remove Chat History",
            onAccept: alert,
          },
        ]);
        break;
    }
  };

  useEffect(() => {
    if (!target.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setOpen(width >= 200);
      }
    });

    observer.observe(target.current);
    return () => observer.disconnect();
  }, []);

  if (location.pathname.includes(ROUTERS.DATABASES.path)) {
    tab = "DB";
  } else if (location.pathname.includes(ROUTERS.MESSAGES.path)) {
    tab = "MSG";
  }

  useEffect(handleForceOpen, [tab]);

  return (
    <section
      className={`${
        !tab && "hidden"
      } h-full resize-x overflow-auto min-w-24 max-w-[500px] flex flex-col justify-start items-center p-4 border-r-2 border-r-gray-50 gap-2`}
      ref={target}
    >
      <section className="border-b-2 border-gray-50 pb-2">
        <SearchInput
          onFinish={handleSearch}
          onClick={handleForceOpen}
          open={open}
        />
      </section>

      {tab === "DB" && (
        <>
          <div
            onClick={() => navigate(createDBPath)}
            className="p-2 flex flex-row text-sm text-blue-400 items-center justify-center gap-2 shadow-sm rounded-full cursor-pointer hover:bg-blue-400 hover:text-white"
          >
            <AddIcon className="size-4" />
            <span>Add new database</span>
          </div>
          <div className="flex-1 flex flex-col justify-start gap-4">
            {getAllDBs.isLoading
              ? Array.from({ length: SKELETON_DB_ITEMS_QUANTITY }).map(
                  (_, index) => (
                    <DBSideBarItemSkeleton key={index} open={open} />
                  )
                )
              : getAllDBs.data?.map((db) => (
                  <DBSideBarItem
                    key={db.id}
                    db={db}
                    open={open}
                    onContextMenu={(e) => handleRightClick(e, "DB", db)}
                  />
                ))}
          </div>
        </>
      )}

      {tab === "MSG" && (
        <div className="flex-1 flex flex-col justify-start gap-4">
          {getAllReceivers.isLoading
            ? Array.from({ length: SKELETON_MSG_ITEMS_QUANTITY }).map(
                (_, index) => <MsgSideBarItemSkeleton key={index} open={open} />
              )
            : getAllReceivers.data?.map((receiver) => (
                <MsgSideBarItem
                  key={receiver.id}
                  receiver={receiver}
                  open={open}
                  onContextMenu={(e) => handleRightClick(e, "MSG", receiver)}
                />
              ))}
        </div>
      )}

      <Modal
        open={!!selectedE}
        onClose={() => setSelectedE(undefined)}
        actions={modalActions}
      >
        {selectedE}
      </Modal>
    </section>
  );
}
