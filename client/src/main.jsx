import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { ChatContextProvider } from "./context/ChatContextProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChatContextProvider>
      <App />
    </ChatContextProvider>
  </StrictMode>
);
