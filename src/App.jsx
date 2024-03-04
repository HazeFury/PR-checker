import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import "./App.css";
import Connection from "./pages/Connection/Connection";
import NavBar from "./components/App-components/Navbar/NavBar";
import supabase from "./services/client";

export default function App() {
  const [thisSession, setThisSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setThisSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setThisSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!thisSession) {
    return <Connection />;
  }
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
