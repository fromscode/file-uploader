import type { RouteObject } from "react-router";
import App from "./App";
import Error from "./Error";
import Dashboard from "./Dashboard";
import FileInsert from "./file-insert";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/begin",
    Component: App,
  },
  {
    path: "/file",
    Component: FileInsert,
  },
  {
    path: "/*",
    Component: Error,
  },
];

export default routes;
