import { createBrowserRouter, Outlet } from "react-router";

import { MainPage } from "./pages/main/MainPage";
import { NotFoundPage } from "./pages/notFound/NotFoundPage";
import { PostDetailsPage } from "./pages/postDetails/PostDetailsPage";
import { SignInPage } from "./pages/signIn/SignInPage";
import { SignUpPage } from "./pages/signUp/SignUpPage";
import { Root } from "./root/Root";
import { RootLayout } from "./root/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Root>
        <RootLayout>
          <Outlet />
        </RootLayout>
      </Root>
    ),
    errorElement: (
      <Root>
        <RootLayout>
          <NotFoundPage />
        </RootLayout>
      </Root>
    ),
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/posts/:id",
        element: <PostDetailsPage />,
      },
    ],
  },
]);
