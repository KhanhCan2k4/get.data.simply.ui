import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type ConsoleContextType = {
  isOpen: boolean;
  openConsole: () => void;
  closeConsole: () => void;
  toggleConsole: () => void;
  setConsoleOpen: (value: boolean) => void;
};

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined);

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openConsole = useCallback(() => setIsOpen(true), []);
  const closeConsole = useCallback(() => setIsOpen(false), []);
  const toggleConsole = useCallback(() => setIsOpen((prev) => !prev), []);
  const setConsoleOpen = useCallback((value: boolean) => setIsOpen(value), []);

  return (
    <ConsoleContext.Provider
      value={{
        isOpen,
        openConsole,
        closeConsole,
        toggleConsole,
        setConsoleOpen,
      }}
    >
      {children}
    </ConsoleContext.Provider>
  );
}

export function useConsole() {
  const context = useContext(ConsoleContext);
  if (!context) {
    throw new Error("useConsole must be used within a ConsoleProvider");
  }
  return context;
}
