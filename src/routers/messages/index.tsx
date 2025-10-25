import { ChatBubbleIcon } from "@/components/icon";

export default function MessagesPage() {
  return (
    <section className="w-full h-full bg-blue-50 flex flex-col items-center justify-center gap-4">
      <div className="animate-bounce text-center">
        <ChatBubbleIcon className="size-20 text-blue-400 mx-auto" />
        <span className="font-semibold text-2xl bg-blue-200 px-1">
          Messages
        </span>
        <p>Select a conversation and get started chatting now</p>
      </div>
    </section>
  );
}
