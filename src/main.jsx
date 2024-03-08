import React from "react";
import ReactDOM from "react-dom/client";
// eslint-disable-next-line import/no-unresolved
import { Toaster } from "sonner";
import { createTheme } from "@mui/material";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";

import App from "./App";
// import Connection from "./pages/Connection/Connection";

import RequestList from "./pages/RequestList/RequestList";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ComponentsPlayground from "./pages/ComponentsPlayground";

const theme = createTheme({
  palette: {
    button: {
      main: "rgb(56, 131, 186)",
      secondary: "rgb(186, 56, 56)",
      hover: "rgb(140, 34, 34)",
    },
    modal: {
      background: "rgb(62, 62, 62)",
    },
    text: {
      primary: "rgba(0, 0, 0)",
      secondary: "rgb(255, 255, 255)",
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
  breakpoints: {
    values: {
      sm: 320,
      md: 440,
      lg: 767,
      xl: 1024,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/components", // To remove before prod
    element: <ComponentsPlayground />, // Use to dev the main components of the app
  },
  {
    path: "/*",
    element: <NotFoundPage />,
  },
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <ProjectPage />,
      },
      {
        path: "/project/:uuid",
        element: <RequestList />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </ThemeProvider>
  </React.StrictMode>
);
