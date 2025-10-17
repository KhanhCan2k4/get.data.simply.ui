import { ROUTERS } from "@/constants/routes";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "@/components/avatar";
import { Receiver } from "@/hooks/apis/use-receivers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type DBSideBarItemProps = {
  receiver: Receiver;
  open: boolean;
};

export default function MsgSideBarItem({
  receiver,
  open,
  ...props
}: DBSideBarItemProps & React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = ROUTERS.MESSAGE_DETAIL.path.replace(":id", receiver.id);
  const active = location.pathname.includes(path);
  return (
    <div
      className={`bg-white flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 rounded-full ${
        active && "text-blue-400"
      }`}
      onClick={() => navigate(path)}
      {...props}
    >
      <Avatar
        name={receiver.name}
        className={`${open ? "w-10 h-10" : "w-12 h-12"} shadow-sm rounded-full`}
      />
      <div
        className={`flex-1 flex flex-col gap-2 break-words min-w-20 ${
          !open && "hidden"
        }`}
      >
        <span className={`font-semibold capitalize`}>{receiver.name}</span>
        <span className={`font-light text-sm`}>{receiver.content}</span>
      </div>
      <span className={`text-xs pr-4 break-words ${!open && "hidden"}`}>
        {dayjs(receiver.createdAt).fromNow()}
      </span>
      {open && receiver.isRead && (
        <div className="w-2 h-2 min-w-2 rounded-full bg-blue-400" />
      )}
    </div>
  );
}
