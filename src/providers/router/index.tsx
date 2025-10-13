import { ROUTERS } from "@/constants/routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(Object.values(ROUTERS));

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
