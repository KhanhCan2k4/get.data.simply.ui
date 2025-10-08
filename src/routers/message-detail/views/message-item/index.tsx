import { Message } from "@/hooks/apis/use-messages";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type MessageItemProps = {
  msg: Message;
};

export default function MessageItem({
  msg,
  onContextMenu,
  ...props
}: MessageItemProps & React.HTMLAttributes<HTMLDivElement>) {
  const badges: string[] = [];
  const myId = "uid1";
  const isMine = msg.receiver.id === myId;

  if (!isMine && msg.isRead) {
    badges.push("Seen");
  }
  if (msg.updatedAt !== msg.createdAt) {
    badges.push("Edited");
  }
  badges.push(`Sent ${dayjs(msg.createdAt).fromNow()}`);

  return (
    <div className="inline-flex flex-col gap-1 cursor-pointer w-full">
      <p
        className={`shadow-sm bg-white p-4 rounded-2xl max-w-2/3 w-fit ${
          isMine ? "self-end rounded-tr-xs" : "rounded-tl-xs"
        }`}
        onContextMenu={onContextMenu}
        {...props}
      >
        {msg.content}
      </p>
      <span
        className={`text-xs pl-2 text-blue-400 bg-gray-50 py-1 px-2 rounded-full ${
          isMine ? "self-end" : "self-start"
        }`}
      >
        <i>{badges.join(", ")}</i>
      </span>
    </div>
  );
}
