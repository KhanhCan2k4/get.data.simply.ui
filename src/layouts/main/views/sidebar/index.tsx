import { useState } from "react";
import { DB, useDBs } from "@/hooks/apis/use-dbs";
import DBSideBarItem from "@/layouts/main/views/db-sidebar-item";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTERS } from "@/constants/routes";
import SearchInput from "@/components/search-input";
import DBSideBarItemSkeleton from "@/layouts/main/views/db-sidebar-item/skeleton";
import Modal from "@/components/modal";
import { Action } from "@/components/modal-action-item";
import {
  AddIcon,
  ChatBubbleIcon,
  CodeIcon,
  ConsoleIcon,
  DownFileIcon,
  GlobleIcon,
  SettingIcon,
  TrashIcon,
  ViewIcon,
} from "@/components/icon";
import { useShortcut } from "@/hooks/use-shortcut";
import Avatar from "@/components/avatar";
import { useConsole } from "@/providers/console";
import __logo from "@public/logo.png";
import { useModal } from "@/providers/modal";

const SKELETON_DB_ITEMS_QUANTITY = 10;

export default function SideBar() {
  /**
   * @router
   */
  const navigate = useNavigate();
  const { database } = useParams<{ database: string }>();

  /**
   * @api
   */
  const { getAllDBs } = useDBs();

  /**
   * @context
   */
  const { openConsole } = useConsole();

  /**
   * @state
   */
  const [open, setOpen] = useState(true);
  const { setModalChildren, setIsModalOpen, setModalActions } = useModal();

  /**
   * @property
   */
  const createDBPath = ROUTERS.DATABASE_CREATE.path;
  const createApiPath = ROUTERS.DATABASE_API_CREATE.path;

  /**
   *  @function
   */
  const handleSearch = (keyword: string) => {};

  const handleOpenMessagesPage = () => {
    if (!database) return;

    const messagesPath = ROUTERS.MESSAGE_DETAIL.path.replace(
      ":database",
      database
    );
    navigate(messagesPath);
  };

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>, db: DB) => {
    e.preventDefault();
    setModalChildren &&
      setModalChildren(
        <DBSideBarItem
          key={db.id}
          db={db}
          open
          onClick={undefined}
          style={{
            scale: 1.1,
            width: 400,
            justifyContent: "start",
            borderRadius: 1000,
          }}
        />
      );

    setModalActions &&
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
          icon: <CodeIcon className="size-4 text-yellow-500" />,
          title: "Create API",
          onClick: () => {
            setIsModalOpen(false);
            navigate(createApiPath.replace(":database", db.name));
          },
        },
        {
          icon: <ChatBubbleIcon className="size-4 text-blue-500" />,
          title: "Open Group Chat",
          onClick: () => {
            setIsModalOpen(false);
            handleOpenMessagesPage();
          },
        },
        {
          icon: <ConsoleIcon className="size-4 text-black" />,
          title: "Open Console",
          onClick: () => {
            setIsModalOpen(false);
            openConsole();
          },
        },
        {
          icon: <GlobleIcon className="size-4 text-blue-900" />,
          title: "Global Variables",
          onClick: () => {
            setIsModalOpen(false);
            openConsole();
          },
        },
        {
          icon: <SettingIcon className="size-4 text-gray-400" />,
          title: "Settings",
          onClick: () => {
            setIsModalOpen(false);
            openConsole();
          },
        },
      ]);

    setIsModalOpen(true);
  };

  useShortcut(["Ctrl", "Alt", "Digit2"], () => setOpen((prev) => !prev));

  return (
    <section
      className={`relative h-full resize-x flex flex-col justify-start items-center py-4 border-r-2 border-r-gray-50 gap-2 z-0 transition-all duration-300 ease-in-out`}
    >
      <button
        className="absolute top-0 right-0 rounded-full p-3 bg-white shadow-sm translate-x-1/2 translate-y-1/5 z-20 opacity-70 hover:opacity-100 hover:bg-blue-400 hover:text-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        <ViewIcon className="size-3" />
      </button>

      <div
        className="flex items-center justify-center gap-2 pb-4 border-b-2 border-b-gray-100 cursor-pointer"
        onClick={() => navigate(ROUTERS.HOME.path)}
      >
        <img src={__logo} alt="Logo" className="w-10 h-10" />
        <div className={`flex flex-col ${!open && "hidden"}`}>
          <span className={`font-bold ${!open && "hidden"}`}>
            Get Data Simply
          </span>
          <span className="font-light text-sm">Version 1.0.0</span>
        </div>
      </div>

      <section className="border-b-2 border-gray-50 pb-2">
        <SearchInput
          onFinish={handleSearch}
          onClick={() => setOpen(true)}
          open={open}
        />
      </section>

      <div
        onClick={() => navigate(createDBPath)}
        className="overflow-y-scroll p-2 flex flex-row text-sm text-blue-400 items-center justify-center gap-2 shadow-sm rounded-full cursor-pointer hover:bg-blue-400 hover:text-white"
      >
        <AddIcon className="size-4" />
        {open && <span>Add new database</span>}
      </div>

      <div className="overflow-y-scroll flex-1 flex flex-col justify-start gap-2">
        {getAllDBs.isLoading
          ? Array.from({ length: SKELETON_DB_ITEMS_QUANTITY }).map(
              (_, index) => <DBSideBarItemSkeleton key={index} open={open} />
            )
          : getAllDBs.data?.map((db) => (
              <DBSideBarItem
                key={db.id}
                db={db}
                open={open}
                onContextMenu={(e) => handleRightClick(e, db)}
              />
            ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-2 border-t-2 border-t-gray-100 cursor-pointer">
        <Avatar name="Hello world" />
        <div className={`flex flex-col ${!open && "hidden"}`}>
          <span className="font-semibold">Hello World</span>
          <span className="font-light text-sm">hello.world@example.com</span>
        </div>
      </div>

      {/* <Modal
        open={!!selectedE}
        onClose={() => setSelectedE(undefined)}
        actions={modalActions}
      >
        {selectedE}
      </Modal> */}
    </section>
  );
}
