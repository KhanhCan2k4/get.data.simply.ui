import MainLayout from "@/layouts/main";
import ApiCreatePage from "@/routers/api-create";
import DatabaseCreatePage from "@/routers/database-create";
import DatabaseDetailPage from "@/routers/database-detail";
import DatabasesPage from "@/routers/databases";
import DetailPage from "@/routers/detail";
import HomePage from "@/routers/home";
import MessageDetailPage from "@/routers/message-detail";
import MessagesPage from "@/routers/messages";
import SettingsPage from "@/routers/settings";
import TableCreatePage from "@/routers/table-create";
import TablesPage from "@/routers/tables";
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
    index: true,
    element: <HomePage />,
  },
  DETAIL: {
    path: "/:id",
    element: <DetailPage />,
  },
  DATABASES: {
    path: "/databases",
    element: (
      <MainLayout>
        <DatabasesPage />
      </MainLayout>
    ),
  },
  DATABASE_DETAIL: {
    path: "/databases/:database",
    element: (
      <MainLayout>
        <DatabaseDetailPage />
      </MainLayout>
    ),
  },
  DATABASE_CREATE: {
    path: "/databases/create",
    element: (
      <MainLayout>
        <DatabaseCreatePage />
      </MainLayout>
    ),
  },
  DATABASE_API_CREATE: {
    path: "/databases/:database/api/create",
    element: (
      <MainLayout>
        <ApiCreatePage />
      </MainLayout>
    ),
  },
  TABLE_DETAIL: {
    path: "/databases/:database/tables/:table",
    element: (
      <MainLayout>
        <TablesPage />
      </MainLayout>
    ),
  },
  TABLE_CREATE: {
    path: "/databases/:database/tables/create",
    element: (
      <MainLayout>
        <TableCreatePage />
      </MainLayout>
    ),
  },
  MESSAGES: {
    path: "/messages",
    element: (
      <MainLayout>
        <MessagesPage />
      </MainLayout>
    ),
  },
  MESSAGE_DETAIL: {
    path: "/messages/:id",
    element: (
      <MainLayout>
        <MessageDetailPage />
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
