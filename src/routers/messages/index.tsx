import { APP_SETTINGS } from "@/constants/settings.enum";
import { Setting, useSettings } from "@/hooks/apis/use-settings";
import { useEffect, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { ChatBubbleIcon } from "@/components/icon";

export default function MessagesPage() {
  const { getOneSetting } = useSettings();
  const key = APP_SETTINGS.MESSAGES_OVERVIEW;
  const [setting, setSetting] = useState<Setting | undefined>();

  useEffect(() => {
    //     getOneSetting(key)
    //       .then(setSetting)
    //       .catch((error) => {
    //         alert(error);
    //       });
    setSetting({
      value: `<h1 class="bg-red-500">Title</h1>`,
    } as Setting);
  }, []);

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
