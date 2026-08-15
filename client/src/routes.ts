import type { RouteObject } from "react-router";
import App from "./App";
import Error from "./Error";
import Dashboard from "./Dashboard";

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
    path: "/*",
    Component: Error,
  },
];

export default routes;
