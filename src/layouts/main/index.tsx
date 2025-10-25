import SideBar from "@/layouts/main/views/sidebar";
import Console from "@/layouts/main/views/console";
import { useModal } from "@/providers/modal";
import Modal from "@/components/modal";

export default function MainLayout({ children }: React.PropsWithChildren) {
  const { isModalOpen, modalChildren, modalActions } = useModal();
  return (
    <section>
      <div className="flex w-screen h-screen font-mono">
        <section>
          <SideBar />
        </section>
        <section
          className={`flex-1 overflow-scroll bg-gray-50 ${
            isModalOpen && "-z-10"
          }`}
        >
          {children}
        </section>
        <Console />
      </div>

      <Modal open={isModalOpen} actions={modalActions}>
        {modalChildren}
      </Modal>
    </section>
  );
}
