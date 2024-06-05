import React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import RootLayout from "./pages/RootLayout/RootLayout";
import ErrorNotFoundPage from "./pages/ErrorNotFoundPage/ErrorNotFoundPage";
import ManegeUsers from "./pages/ManageUsers/ManegeUsers";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthContext } from "./utils/contexts/authContext";
import { useAuth } from "./utils/hooks/useAuth";
import { UserDialogProvider } from "./utils/contexts/userDialogContext";

const queryClient = new QueryClient();

const handleRouter = (token: string | null, managePerm: boolean) => {
  let router;

  router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <Navigate to="/login" replace /> },
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
          { path: "*", element: <ErrorNotFoundPage /> },
        ],
      },
    ]);
  }

  return router;
};

const App: React.FC = () => {
  const { token, login, logout, user } = useAuth(); // Changed userId to user

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        user: user,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <UserDialogProvider>
          <RouterProvider router={handleRouter(token, !!user?.managePerm)} />
        </UserDialogProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
