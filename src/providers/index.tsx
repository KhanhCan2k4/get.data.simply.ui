import { ConsoleProvider } from "@/providers/console";
import { ModalProvider } from "@/providers/modal";
import { AppQueryClientProvider } from "@/providers/query-client";
import { AppRouterProvider } from "@/providers/router";

export function Providers() {
  return (
    <AppQueryClientProvider>
      <ConsoleProvider>
        <ModalProvider>
          <AppRouterProvider />
        </ModalProvider>
      </ConsoleProvider>
    </AppQueryClientProvider>
  );
}
