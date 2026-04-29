import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Landing from "@/pages/Landing";
import AppShell from "@/pages/AppShell";
import Board from "@/pages/Board";
import ScopeTab from "@/pages/ScopeTab";
import Billing from "@/pages/Billing";
import ClientView from "@/pages/ClientView";
import NewProject from "@/pages/NewProject";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/new" element={<NewProject />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="board" replace />} />
            <Route path="board" element={<Board />} />
            <Route path="scope" element={<ScopeTab />} />
            <Route path="billing" element={<Billing />} />
            <Route path="client" element={<ClientView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1A1A18",
            color: "#F7F5F0",
            border: "1px solid #1A1A18",
            borderRadius: 0,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 12,
            letterSpacing: "0.02em",
          },
        }}
      />
    </div>
  );
}
