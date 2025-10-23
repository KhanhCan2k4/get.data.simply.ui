import SideBar from "@/routers/messages/views/sidebar";

export default function MessagesLayout({ children }: React.PropsWithChildren) {
  return (
    <section>
      <div className="flex w-full h-screen bg-white">
        <section>
          <SideBar />
        </section>
        <section className="flex-1 overflow-scroll bg-gray-50">
          {children}
        </section>
      </div>
    </section>
  );
}
