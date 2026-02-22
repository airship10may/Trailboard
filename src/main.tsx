import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { loadEntitlement } from "./data/entitlement";
import {
  applyThemeToDocument,
  getThemeFromStorage,
  resolveThemeForEntitlement,
} from "./data/theme";

const entitlement = loadEntitlement();
const initialTheme = resolveThemeForEntitlement(getThemeFromStorage(), entitlement);
applyThemeToDocument(initialTheme);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
