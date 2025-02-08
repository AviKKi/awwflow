import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DnDProvider } from "./utils/dragAndDrop.tsx";
import { ReactFlowProvider } from "@xyflow/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DnDProvider>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </DnDProvider>
  </StrictMode>
);
