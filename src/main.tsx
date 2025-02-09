// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 🔹 Extend window object to include __REACT_DEVTOOLS_GLOBAL_HOOK__
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
      supportsFiber: boolean;
      inject: () => void;
      onCommitFiberRoot: () => void;
      onCommitFiberUnmount: () => void;
    };
  }
}

// ✅ Disable React DevTools in production (without TypeScript errors)
if (import.meta.env.PROD) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true,
    inject: () => {},
    onCommitFiberRoot: () => {},
    onCommitFiberUnmount: () => {},
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
