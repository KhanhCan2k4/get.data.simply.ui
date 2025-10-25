import MainLayout from "@/layouts/main";
import MessagesLayout from "@/layouts/messages";
import ApiCreatePage from "@/routers/api-create";
import DatabaseCreatePage from "@/routers/database-create";
import DatabaseDetailPage from "@/routers/database-detail";
import DashboardPage from "@/routers/databases";
import MessageDetailPage from "@/routers/message-detail";
import MessagesPage from "@/routers/messages";
import SettingsPage from "@/routers/settings";
import TableCreatePage from "@/routers/table-create";
import TableDetailPage from "@/routers/table-detail";
import { ReactElement } from "react";

type AppRoute = {
  path: string;
  index?: boolean;
  element: ReactElement;
};

type AppRouter = {
  [key: string]: AppRoute;
};

const ROUTERS: AppRouter = {
  HOME: {
    path: "/",
    element: (
      <MainLayout>
        <DashboardPage />
      </MainLayout>
    ),
    index: true,
  },
  DATABASE_DETAIL: {
    path: "/:database",
    element: (
      <MainLayout>
        <DatabaseDetailPage />
      </MainLayout>
    ),
  },
  DATABASE_CREATE: {
    path: "/create",
    element: (
      <MainLayout>
        <DatabaseCreatePage />
      </MainLayout>
    ),
  },
  DATABASE_API_CREATE: {
    path: "/:database/api/create",
    element: (
      <MainLayout>
        <ApiCreatePage />
      </MainLayout>
    ),
  },
  TABLE_DETAIL: {
    path: "/:database/tables/:table",
    element: (
      <MainLayout>
        <TableDetailPage />
      </MainLayout>
    ),
  },
  TABLE_CREATE: {
    path: "/:database/tables/create",
    element: (
      <MainLayout>
        <TableCreatePage />
      </MainLayout>
    ),
  },
  MESSAGES: {
    path: "/:database/messages",
    element: (
      <MainLayout>
        <MessagesLayout>
          <MessagesPage />
        </MessagesLayout>
      </MainLayout>
    ),
  },
  MESSAGE_DETAIL: {
    path: "/:database/messages/:id",
    element: (
      <MainLayout>
        <MessagesLayout>
          <MessageDetailPage />
        </MessagesLayout>
      </MainLayout>
    ),
  },
  SETTINGS: {
    path: "/settings",
    element: (
      <MainLayout>
        <SettingsPage />
      </MainLayout>
    ),
  },
};

export { ROUTERS };
