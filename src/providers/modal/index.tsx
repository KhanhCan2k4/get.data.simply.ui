import { Action } from "@/components/modal-action-item";
import { createContext, useContext, useState, ReactNode } from "react";

type ModalContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  modalChildren?: ReactNode;
  setModalChildren?: (children: ReactNode) => void;
  modalActions?: Action[];
  setModalActions?: (actions: Action[]) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChildren, setModalChildren] = useState<ReactNode>(null);
  const [modalActions, setModalActions] = useState<Action[]>([]);

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        modalChildren,
        setModalChildren,
        modalActions,
        setModalActions,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
