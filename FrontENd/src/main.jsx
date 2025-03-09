import React from "react";
import { createRoot } from "react-dom/client"; // استيراد createRoot
import App from "./App";
import { ThemeProviderWrapper } from "./contexts/ThemeContext";

// إنشاء جذر التطبيق
const container = document.getElementById("root");
const root = createRoot(container); // إنشاء جذر باستخدام createRoot

// تقديم التطبيق
root.render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <App />
    </ThemeProviderWrapper>
  </React.StrictMode>
);
