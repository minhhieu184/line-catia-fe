import { Suspense } from "react";
import ReactDOM from "react-dom/client";

import React from "react";
import { Root } from "./Root";
import SplashScreen from "./components/SplashScreen";
import "./globals.css";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<SplashScreen />}>
      <Root />
    </Suspense>
  </React.StrictMode>
);
