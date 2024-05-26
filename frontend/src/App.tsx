import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import RootLayout from "./pages/RootLayout/RootLayout";
import ErrorNotFoundPage from "./pages/ErrorNotFoundPage/ErrorNotFoundPage";
import ManegeUsers from "./pages/ManageUsers/ManegeUsers";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
export default function App() {
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
          { path: "/users", element: <ManegeUsers /> },

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
            { path: "/users", element: <ManegeUsers /> },
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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={handleRouter(true, true)} />
    </QueryClientProvider>
  );
}
