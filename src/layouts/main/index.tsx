import Navbar from "@/layouts/main/views/navbar";
import SideBar from "@/layouts/main/views/sidebar";
import Console from "@/layouts/main/views/console";
import { useState } from "react";
import { DB } from "@/hooks/apis/use-dbs";

type MainLayoutProps = {
  title?: string | React.ReactElement;
};

export default function MainLayout({
  children,
  title,
}: React.PropsWithChildren & MainLayoutProps) {
  const [openConsole, setOpenConsole] = useState(false);

  return (
    <section>
      <div className="flex w-screen h-screen font-mono">
        <section>
          <Navbar onOpenConsole={() => {}} />
        </section>
        <section>
          <SideBar />
        </section>
        <section className="flex-1 overflow-scroll bg-gray-50">
          {children}
        </section>
        <Console />
      </div>
    </section>
  );
}
