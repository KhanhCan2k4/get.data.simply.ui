import Avatar from "@/components/avatar";
import { ROUTERS } from "@/constants/routes";
import { Message, useMessages } from "@/hooks/apis/use-messages";
import { User, useUsers } from "@/hooks/apis/use-users";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Action } from "@/components/modal-action-item";
import {
  CloseIcon,
  CopyIcon,
  DoubleDownIcon,
  DownIcon,
  EditIcon,
  ForwardIcon,
  LoadIcon,
  SendIcon,
  TrashIcon,
  UpIcon,
} from "@/components/icon";
import Modal from "@/components/modal";
import MessageItem from "@/routers/message-detail/views/message-item";
import Alert, { AlertType } from "@/components/alert";
import { useAlert } from "@/hooks/use-alert";
import SearchInput from "@/components/search-input";

export default function MessageDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const msgListRef = useRef<HTMLDivElement>(null);
  const { getOneUser } = useUsers();
  const { getAllMessages } = useMessages();
  const [receiver, setReceiver] = useState<User | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedE, setSelectedE] = useState<React.JSX.Element>();
  const [repliedMsg, setRepliedMsg] = useState<Message>();
  const [editedMsg, setEditedMsg] = useState<Message>();
  const [modalActions, setModalActions] = useState<Action[]>([]);
  const { alertElement, setAlertOptions } = useAlert();
  const [isOnTop, setIsOnTop] = useState(false);
  const [isOnBottom, setIsOnBottom] = useState(false);
  const [foundMsgIdx, setFoundMsgIdx] = useState(0);
  const [foundMsgIds, setFoundMsgIds] = useState<string[]>([]);

  const handleRemoveMsg = (msg: Message) => {
    setSelectedE(undefined);
    setAlertOptions(
      AlertType.SUCCESS,
      <div key={msg.id} className="text-center font-light italic">
        Remove [{msg.content.substring(0, 20)}...] successfully!!
      </div>
    );
  };

  const handleCopyMsg = async (msg: Message) => {
    setSelectedE(undefined);

    await navigator.clipboard.writeText(msg.content);

    setAlertOptions(
      AlertType.INFO,
      <div key={msg.id} className="text-center font-light italic">
        Copy [{msg.content.substring(0, 20)}...] successfully!!
      </div>
    );
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    data: Message
  ) => {
    e.preventDefault();
    setSelectedE(
      <MessageItem
        className="shadow-sm bg-white w-[500px] p-4 flex rounded-2xl rounded-tl-xs"
        msg={data}
      />
    );

    setModalActions([
      {
        icon: <TrashIcon className="size-4 text-red-500" />,
        title: "Remove this message",
        onAccept: () => handleRemoveMsg(data),
      },
      {
        icon: <ForwardIcon className="size-4 text-purple-500" />,
        title: "Reply this message",
        onClick: () => {
          setSelectedE(undefined);
          setEditedMsg(undefined);
          setRepliedMsg(data);
        },
      },
      {
        icon: <EditIcon className="size-4 text-orange-500" />,
        title: "Edit this message",
        onClick: () => {
          setSelectedE(undefined);
          setRepliedMsg(undefined);
          setEditedMsg(data);
        },
      },
      {
        icon: <CopyIcon className="size-4 text-yellow-500" />,
        title: "Copy this message",
        onClick: () => handleCopyMsg(data),
      },
    ]);
  };

  const handleScroll = () => {
    if (!msgListRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = msgListRef.current;
    setIsOnTop(scrollTop === 0);
    setIsOnBottom(scrollTop + clientHeight >= scrollHeight - 1);
  };

  const scrollToBottom = () => {
    if (!msgListRef.current) return;

    msgListRef.current.scrollTo({ top: 1000, behavior: "smooth" });
  };

  const handleUpDown = (direction: "up" | "down") => {
    switch (direction) {
      case "up":
        if (foundMsgIdx < foundMsgIds.length - 1)
          setFoundMsgIdx(foundMsgIdx + 1);
        break;
      case "down":
        if (foundMsgIdx > 0) setFoundMsgIdx(foundMsgIdx - 1);
        break;
    }
  };

  useEffect(() => {
    if (!id) {
      () => navigate(ROUTERS.MESSAGES.path);
      return;
    }

    // getOneReceiver(id)
    //   .then(setReceiver)
    //   .catch(() => navigate(ROUTERS.MESSAGES.path));

    setReceiver({
      id: id,
      name: "APT",
      email: "apt@example.com",
    } as User);
  }, [id]);

  useEffect(() => {
    if (!receiver) return;

    setMessages(getAllMessages.data ?? []);
  }, [receiver]);

  return (
    receiver && (
      <section className="p-2 flex flex-col h-full gap-2">
        <div className="p-2 bg-white shadow-sm rounded-full flex flex-row items-center gap-2">
          <Avatar name={receiver.name} className="w-12 h-12" />
          <div className="flex-1 flex flex-col">
            <span className="font-semibold">{receiver.name}</span>
            <span className="font-light">{receiver.email}</span>
          </div>
          <div className="flex gap-2 items-center">
            {foundMsgIds.length > 0 && (
              <>
                <span className="text-xs italic">
                  Found {foundMsgIdx + 1}/{foundMsgIds.length} messages
                </span>
                <UpIcon
                  className="size-4 cursor-pointer"
                  onClick={() => handleUpDown("up")}
                />
                <DownIcon
                  className="size-4 cursor-pointer"
                  onClick={() => handleUpDown("down")}
                />
              </>
            )}
            <SearchInput onFinish={console.log} open />
          </div>
        </div>
        {alertElement && <div>{alertElement}</div>}

        {getAllMessages.isLoading && (
          <LoadIcon className="mx-auto size-6 animate-spin text-blue-400" />
        )}
        <div
          ref={msgListRef}
          onScroll={handleScroll}
          className="flex-1 flex flex-col gap-2 overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {messages.map((msg) => (
            <MessageItem
              key={msg.id}
              msg={msg}
              onContextMenu={(e) => handleRightClick(e, msg)}
            />
          ))}
        </div>

        {repliedMsg && (
          <>
            <div className="flex justify-between">
              <span className="py-1">Replying to: </span>
              <CloseIcon
                className="w-5 h-5 self-center cursor-pointer"
                onClick={() => setRepliedMsg(undefined)}
              />
            </div>
            <div className="border-1 p-2 border-gray-300 flex">
              <MessageItem
                key={repliedMsg.id}
                msg={repliedMsg}
                onClick={undefined}
              />
            </div>
          </>
        )}
        {editedMsg && (
          <>
            <div className="flex justify-between">
              <span className="py-1">Editing: </span>
              <CloseIcon
                className="w-5 h-5 self-center cursor-pointer"
                onClick={() => setEditedMsg(undefined)}
              />
            </div>
            <div className="border-1 p-2 border-gray-300 flex">
              <MessageItem
                key={editedMsg.id}
                msg={editedMsg}
                onClick={undefined}
              />
            </div>
          </>
        )}
        <div className="flex flex-row gap-4 w-full relative">
          {!isOnBottom && (
            <DoubleDownIcon
              onClick={scrollToBottom}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 size-6 cursor-pointer animate-bounce text-orange-400 z-10"
            />
          )}

          <div className="flex-1 relative">
            <textarea
              rows={2}
              placeholder="Type your message..."
              className="w-full h-full py-2 pr-4 pl-10 bg-white rounded-xl outline-0 shadow-sm self-center resize-none"
            ></textarea>

            <EditIcon className="absolute text-gray-400 top-4 left-4 w-4 h-4" />
            <CloseIcon className="absolute text-gray-400 top-4 right-4 w-4 h-4 hover:text-red-500 hover:scale-120" />
          </div>

          <div className="rounded-full w-20 h-20 bg-white flex items-center justify-center shadow-sm hover:bg-blue-400 hover:text-white hover:-rotate-45 transition-all duration-300">
            <SendIcon className="w-6 h-6" />
          </div>
        </div>

        <Modal
          open={!!selectedE}
          actions={modalActions}
          onClose={() => setSelectedE(undefined)}
        >
          {selectedE}
        </Modal>
      </section>
    )
  );
}
