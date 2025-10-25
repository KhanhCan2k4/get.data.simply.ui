import Avatar from "@/components/avatar";
import { MenuIcon } from "@/components/icon";
import { Message } from "@/hooks/apis/use-messages";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
dayjs.extend(relativeTime);

type MessageItemProps = {
  msg: Message;
  hasPrevItem?: boolean;
  hasNextItem?: boolean;
  highlighted?: boolean;
  onOpenMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function MessageItem({
  msg,
  hasNextItem = false,
  hasPrevItem = false,
  highlighted = false,
  onOpenMenu,
  onContextMenu,
  ...props
}: MessageItemProps & React.HTMLAttributes<HTMLDivElement>) {
  const badges: string[] = [];
  const myId = "uid1";
  const isMine = msg.sender.id === myId;
  const [showBadges, setShowBadges] = useState(!hasNextItem);

  if (!isMine && msg.isRead) {
    badges.push("Seen");
  }
  if (msg.updatedAt !== msg.createdAt) {
    badges.push("Edited");
  }
  badges.push(`Sent ${dayjs(msg.createdAt).fromNow()}`);

  const handleOpenMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onOpenMenu && onOpenMenu(e);
  };

  return (
    <div
      className={`inline-flex gap-2 cursor-pointer w-fit
    ${isMine ? "self-end max-w-2/3 flex-row-reverse" : ""}
      ${highlighted ? "border-2 border-blue-500 rounded-lg p-2" : ""}
    `}
      onContextMenu={onContextMenu}
      onClick={() => setShowBadges((prev) => !prev)}
    >
      <Avatar
        name={msg.sender.name}
        className={hasPrevItem ? `opacity-0` : "size-6"}
      />

      <div className={`inline-flex gap-2 flex-col`}>
        <p
          className={`shadow-sm bg-white p-4 rounded-2xl
             ${isMine ? "rounded-tr-xs" : "rounded-tl-xs"}
            `}
          {...props}
        >
          {msg.content}
        </p>

        {showBadges && (
          <span
            className={`text-xs pl-2 text-blue-400 bg-gray-50 py-1 px-2 rounded-full ${
              isMine ? "self-end" : "self-start"
            }`}
          >
            <i>{badges.join(", ")}</i>
          </span>
        )}
      </div>

      {onOpenMenu && (
        <div
          className="bg-white shadow-sm p-2 rounded-full w-fit h-fit self-bottom cursor-pointer"
          onClick={handleOpenMenu}
        >
          <MenuIcon className="size-4" />
        </div>
      )}
    </div>
  );
}
