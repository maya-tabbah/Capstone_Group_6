import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import Chat from "./pages/chat";
import Settings from "./pages/settings";
import History from "./pages/history";
import Waiting from "./pages/waiting";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/waiting",
    Component: Waiting,
  },
  {
    path: "/chat",
    Component: Chat,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/history",
    Component: History,
  },
]);
