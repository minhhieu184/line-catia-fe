import { Toaster } from "@/components/ui/sonner";
import { setDebug } from "@telegram-apps/sdk";
import { type FC, useEffect, useMemo, useState } from "react";

import FriendsPage from "@/pages/Catia/FriendsPage.tsx";
import { SDKProvider } from "@telegram-apps/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  ToastErrorIcon,
  ToastInfoIcon,
  ToastSuccessIcon,
} from "./assets/Toast/SVGs";
import Providers from "./components/Providers";
import SplashScreen from "./components/SplashScreen";
import ArenaDetailPage from "./pages/Catia/ArenaDetailPage";
import ArenaLeaderboardPage from "./pages/Catia/ArenaLeaderboardPage";
import CatiarenaPage from "./pages/Catia/CatiarenaPage";
import FreebiesPage from "./pages/Catia/FreebiesPage";
import LeaderboardPage from "./pages/Catia/LeaderboardPage";
import MainPage from "./pages/Catia/MainPage";
import QuizDetailPage from "./pages/Catia/QuizDetailPage";
import QuizLeaderboardPage from "./pages/Catia/QuizLeaderboardPage";
import QuizPage from "./pages/Catia/QuizPage";
import QuizzesPage from "./pages/Catia/QuizzesPage";
import TaskPage from "./pages/Catia/TaskPage";
import { InitDataPage } from "./pages/InitDataPage/InitDataPage";
import { LaunchParamsPage } from "./pages/LaunchParamsPage/LaunchParamsPage";
import {
  LayoutCatiarena,
  LayoutFull,
  LayoutWithoutHeader,
  LayoutWithoutHeaderAndNav,
} from "./pages/Layout";
import { ThemeParamsPage } from "./pages/ThemeParamsPage/ThemeParamsPage";

const router = createBrowserRouter([
  {
    Component: LayoutFull,
    children: [
      { path: "/", Component: MainPage, id: "index" },
      { path: "/init-data", Component: InitDataPage },
      { path: "/theme-params", Component: ThemeParamsPage },
      {
        path: "/launch-params",
        Component: LaunchParamsPage,
      },
    ],
  },
  {
    Component: LayoutWithoutHeader,
    children: [
      { path: "/quizzes", Component: QuizzesPage, id: "quizzes" },
      { path: "/friends", Component: FriendsPage, id: "friends" },
      { path: "/tasks", Component: TaskPage, id: "tasks" },
    ],
  },
  {
    Component: LayoutWithoutHeaderAndNav,
    children: [
      { path: "/freebies", Component: FreebiesPage, id: "freebies" },
      { path: "/leaderboard", Component: LeaderboardPage, id: "leaderboard" },
      { path: "/:game", Component: QuizDetailPage, id: "quiz-detail" },
      { path: "/quiz/:game", Component: QuizPage, id: "quiz-game" },
      {
        path: "/game/:game/leaderboard",
        Component: QuizLeaderboardPage,
        id: "game-leaderboard",
      },
      {
        path: "/catiarena/:slug/leaderboard",
        Component: ArenaLeaderboardPage,
        id: "arena-leaderboard",
      },
    ],
  },
  {
    Component: LayoutCatiarena,
    children: [
      { path: "/catiarena", Component: CatiarenaPage, id: "catiarena" },
      {
        path: "/catiarena/:slug",
        Component: ArenaDetailPage,
        id: "catiarena-detail",
      },
    ],
  },
]);

// const Err: FC<{ error: unknown }> = ({ error }) => {
//   return (
//     <div>
//       <p>An error occurred while initializing the SDK</p>
//       <blockquote>
//         <code>
//           {error instanceof Error ? error.message : JSON.stringify(error)}
//         </code>
//       </blockquote>
//     </div>
//   );
// };

// const Loading: FC = () => {
//   return (
//     <div className="flex items-center justify-center">
//       Application is loading
//     </div>
//   );
// };

export const Root: FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setDebug(true);
  }, []);

  useEffect(() => {
    const timeId = setTimeout(() => setIsMounted(true), 3000);
    return () => clearTimeout(timeId);
  }, []);

  const manifestUrl = useMemo(() => {
    return new URL("tonconnect-manifest.json", window.location.href).toString();
  }, []);

  return (
    <SDKProvider
      acceptCustomStyles
      // options={{ acceptCustomStyles: true, cssVars: true, complete: true }}
    >
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <Providers>
          <RouterProvider router={router} />
          <Toaster
            position="top-center"
            richColors
            duration={3000}
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  "rounded-lg group-[.toaster]:pointer-events-auto shadow-lg flex items-center py-3 px-4 gap-4 !bg-secondary !text-secondary-foreground text-sm data-close-button-[state=closed]:right-0",
                closeButton: "left-auto right-3 top-1/2 -translate-y-1/2",
              },
              closeButton: true,
            }}
            icons={{
              success: <ToastSuccessIcon className="h-7 w-7" />,
              info: <ToastInfoIcon className="h-7 w-7" />,
              error: <ToastErrorIcon className="h-7 w-7" />,
            }}
          />
          {!isMounted && (
            <div className="fixed left-0 top-0 z-50 h-screen w-screen">
              <SplashScreen />
            </div>
          )}
        </Providers>
      </TonConnectUIProvider>
    </SDKProvider>
  );
};
