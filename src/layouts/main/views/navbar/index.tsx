import Avatar from "@/components/avatar";
import {
  ChatBubbleIcon,
  ConsoleIcon,
  DatabaseIcon,
  SettingIcon,
} from "@/components/icon";
import NavbarItem from "@/layouts/main/views/navbar-item";
import { useEffect, useRef, useState } from "react";
import { ROUTERS } from "@/constants/routes";
import __logo from "@public/logo.png";
import { DB } from "@/hooks/apis/use-dbs";

type NavbarProps = {
  onOpenConsole: (db: DB) => void;
};

export default function Navbar({ onOpenConsole }: NavbarProps) {
  const target = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  let consolePath = `${window.location.pathname}`;
  if (window.location.search.includes("?")) {
    consolePath += window.location.search;
    consolePath += "&console=1";
  } else {
    consolePath += "?console=1";
  }

  const NAV_ITEMS = [
    {
      icon: <DatabaseIcon />,
      path: ROUTERS.DATABASES.path,
      displayName: ROUTERS.DATABASES.path.replace("/", "").toUpperCase(),
    },
    {
      icon: <ChatBubbleIcon />,
      path: ROUTERS.MESSAGES.path,
      displayName: ROUTERS.MESSAGES.path.replace("/", "").toUpperCase(),
    },
    {
      icon: <SettingIcon />,
      path: ROUTERS.SETTINGS.path,
      displayName: ROUTERS.SETTINGS.path.replace("/", "").toUpperCase(),
    },
  ];

  useEffect(() => {
    if (!target.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setOpen(width >= 200);
      }
    });

    observer.observe(target.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      className={`flex flex-col h-full resize-x overflow-auto min-w-20 max-w-[500px] p-4 border-r-2 border-r-gray-50`}
      ref={target}
    >
      <div className="flex items-center justify-center gap-2 pb-4 border-b-2 border-b-gray-100">
        <img src={__logo} alt="Logo" className="w-10 h-10" />
        <div className={`flex flex-col ${!open && "hidden"}`}>
          <span className={`font-bold ${!open && "hidden"}`}>
            Get Data Simply
          </span>
          <span className="font-light text-sm">Version 1.0.0</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-start mt-10 gap-4">
        {NAV_ITEMS.map((item) => (
          <NavbarItem key={item.path} open={open} {...item} />
        ))}
      </div>

      <div className="flex items-center justify-center py-2 border-t-2 border-t-gray-100">
        <NavbarItem
          open={open}
          icon={<ConsoleIcon />}
          path={consolePath}
          displayName="CONSOLE"
          onClick={() => onOpenConsole({ id: "id", name: "name", tables: [] })}
        />
      </div>

      <div className="flex items-center justify-center gap-2 pt-2 border-t-2 border-t-gray-100">
        <Avatar name="Hello world" className="w-10 h-10" />
        <div className={`flex flex-col ${!open && "hidden"}`}>
          <span className="font-semibold">Hello World</span>
          <span className="font-light text-sm">hello.world@example.com</span>
        </div>
      </div>
    </section>
  );
}
