//App.js

// import React, { useState } from "react";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import createCache, { StylisPlugin } from "@emotion/cache";
// import rtlPlugin from "stylis-plugin-rtl";
// import { prefixer } from "stylis";
// import { CacheProvider } from "@emotion/react";
// import SwitchMode from "./utils/SwitchMode";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import RootLayout from "./pages/RootLayout/RootLayout";
import ErrorNotFoundPage from "./pages/ErrorNotFoundPage/ErrorNotFoundPage";

// const cacheRtl = createCache({
//   key: "muirtl",
//   stylisPlugins: [
//     prefixer as unknown as StylisPlugin,
//     rtlPlugin as unknown as StylisPlugin,
//   ],
// });
export default function App() {
  // const [darkMode, setDarkMode] = useState(true);

  // const toggleDarkTheme = () => {
  //   setDarkMode(!darkMode);
  // };

  // const darkTheme = createTheme({
  //   direction: "rtl",
  //   palette: {
  //     mode: darkMode ? "dark" : "light", // handle the dark mode state on toggle
  //     primary: {
  //       light: "#757ce8",
  //       main: "#3f50b5",
  //       dark: "#002884",
  //       contrastText: "#fff",
  //     },
  //     secondary: {
  //       light: "#ff7961",
  //       main: "#f44336",
  //       dark: "#ba000d",
  //       contrastText: "#000",
  //     },
  //   },
  // });

  const handleRouter = (token: boolean, managePerm: boolean) => {
    let router;
    router = createBrowserRouter([
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { path: "/", element: <Navigate to="/login" replace /> },
          // { path: "/login", element: <LoginPage /> },
          // { path: "about", element: <AboutPage /> },
          { path: "*", element: <ErrorNotFoundPage /> },
        ],
      },
    ]);
    if (token && managePerm) {
      router = createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          children: [
            { path: "/", element: <Navigate to="/halalim" replace /> },
            // { path: "about", element: <AboutPage /> },
            // {
            //   path: "/halalim",
            //   element: <HalalimPage />,
            // },
            // { path: "/manageUsers", element: <ManageUsersPage /> },
            // { path: "/manageGraveyards", element: <ManageGraveyardsPage /> },
            // { path: "/manageCommands", element: <ManageCommandsPage /> },
            // { path: "/manageColumns", element: <ManageColumnsPage /> },
            // {
            //   path: "/manageSoldierAccompanied",
            //   element: <ManageSoldierAccompaniedPage />,
            // },
            // { path: "/manageLeftOvers", element: <ManageLeftOversPage /> },
            { path: "*", element: <ErrorNotFoundPage /> },
          ],
        },
      ]);
    } else if (token) {
      router = createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          children: [
            { path: "/", element: <Navigate to="/halalim" replace /> },
            { path: "/login", element: <Navigate to="/halalim" replace /> },
            // { path: "about", element: <AboutPage /> },
            // {
            //   path: "/halalim",
            //   element: <HalalimPage />,
            // },
            // {
            //   path: "/manageSoldierAccompanied",
            //   element: <ManageSoldierAccompaniedPage />,
            // },
            // { path: "/manageLeftOvers", element: <ManageLeftOversPage /> },
            { path: "*", element: <ErrorNotFoundPage /> },
          ],
        },
      ]);
    }
    return router;
  };

  return <RouterProvider router={handleRouter(true, true)} />;
}
