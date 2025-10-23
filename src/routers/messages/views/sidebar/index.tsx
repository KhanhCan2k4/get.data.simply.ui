import { useEffect, useRef, useState } from "react";
import { Receiver, useReceivers } from "@/hooks/apis/use-receivers";
import MsgSideBarItem from "@/layouts/main/views/msg-sidebar-item";
import SearchInput from "@/components/search-input";
import MsgSideBarItemSkeleton from "@/layouts/main/views/msg-sidebar-item/skeleton";
import Modal from "@/components/modal";
import { Action } from "@/components/modal-action-item";
import { useShortcut } from "@/hooks/use-shortcut";
import __logo from "@public/logo.png";
import { TrashIcon } from "@/components/icon";

const SKELETON_MSG_ITEMS_QUANTITY = 10;

export default function SideBar() {
  const target = useRef<HTMLDivElement>(null);
  const [selectedE, setSelectedE] = useState<React.JSX.Element>();
  const [modalActions, setModalActions] = useState<Action[]>([]);
  const [open, setOpen] = useState(true);
  const { getAllReceivers } = useReceivers();

  const handleSearch = (keyword: string) => {};

  const handleForceOpen = () => {
    setOpen(true);
    if (target.current) {
      target.current.style.width = "auto";
    }
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    receiver: Receiver
  ) => {
    e.preventDefault();
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
  };

  const handleToggleOpen = () => {
    if (!target.current) return;

    setOpen(!open);
    target.current.style.width = "auto";
  };

  useShortcut(["Ctrl", "Alt", "Digit2"], handleToggleOpen);

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

  useEffect(handleForceOpen, []);

  return (
    <section
      className={`h-full resize-x overflow-auto min-w-24 max-w-[500px] flex flex-col justify-start items-center p-4 border-r-2 border-r-gray-50 gap-2`}
      ref={target}
    >
      <section className="border-b-2 border-gray-50 pb-2">
        <SearchInput
          onFinish={handleSearch}
          onClick={handleForceOpen}
          open={open}
        />
      </section>

      <div className="overflow-y-scroll flex-1 flex flex-col justify-start gap-4">
        {getAllReceivers.isLoading
          ? Array.from({ length: SKELETON_MSG_ITEMS_QUANTITY }).map(
              (_, index) => <MsgSideBarItemSkeleton key={index} open={open} />
            )
          : getAllReceivers.data?.map((receiver) => (
              <MsgSideBarItem
                key={receiver.id}
                receiver={receiver}
                open={open}
                onContextMenu={(e) => handleRightClick(e, receiver)}
              />
            ))}
      </div>

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
