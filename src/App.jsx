import { useEffect, useState } from "react";
import { supabase } from "./services/client";
import { Outlet } from "react-router-dom";
import "./App.css";
import Connection from "./pages/Connection/Connection";
import NavBar from "./components/App-components/Navbar/NavBar";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Connection />;
  } else {
    return (
      <div>
        <NavBar />
        <Outlet />
      </div>
    );
  }
}
