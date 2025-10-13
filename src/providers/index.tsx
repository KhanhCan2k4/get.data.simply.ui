import { ConsoleProvider } from "@/providers/console";
import { AppQueryClientProvider } from "@/providers/query-client";
import { AppRouterProvider } from "@/providers/router";

export function Providers() {
  return (
    <AppQueryClientProvider>
      <ConsoleProvider>
        <AppRouterProvider />
      </ConsoleProvider>
    </AppQueryClientProvider>
  );
}
