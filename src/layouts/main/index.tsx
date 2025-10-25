import SideBar from "@/layouts/main/views/sidebar";
import Console from "@/layouts/main/views/console";

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <section>
      <div className="flex w-screen h-screen font-mono">
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
