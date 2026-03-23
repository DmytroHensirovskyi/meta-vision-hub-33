import { useState, useEffect } from "react";
import AuthScreen from "@/components/AuthScreen";
import Dashboard from "@/components/Dashboard";

type View = "auth" | "dashboard";

const Index = () => {
  const [view, setView] = useState<View>("auth");
  const [token, setToken] = useState<string>("");

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("metaapi_token");
    if (saved) {
      setToken(saved);
      setView("dashboard");
    }
  }, []);

  const handleConnect = (newToken: string) => {
    setToken(newToken);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("metaapi_token");
    setToken("");
    setView("auth");
  };

  if (view === "dashboard" && token) {
    return <Dashboard token={token} onLogout={handleLogout} />;
  }

  return <AuthScreen onConnect={handleConnect} />;
};

export default Index;
