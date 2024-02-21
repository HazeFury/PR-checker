import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
// import Connection from "./pages/Connection/Connection";
import RequestList from "./pages/RequestList/RequestList";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ComponentsPlayground from "./pages/ComponentsPlayground";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Connection />,
  // },
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
    <RouterProvider router={router} />
  </React.StrictMode>,
);
