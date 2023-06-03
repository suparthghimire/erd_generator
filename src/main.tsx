import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MainLayout } from "./components/Layout/MainLayout.tsx";
import "./index.css";
import ERDProvider from "./lib/context/ERDContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ERDProvider>
      <MainLayout>
        <App />
      </MainLayout>
    </ERDProvider>
  </React.StrictMode>
);
