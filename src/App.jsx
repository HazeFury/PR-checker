import { useEffect, useState, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./App.css";
import Connection from "./pages/Connection/Connection";
import NavBar from "./components/App-components/Navbar/NavBar";
import supabase from "./services/client";
import refreshContext from "./contexts/RefreshContext";

export default function App() {
  const [thisSession, setThisSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const navigate = useNavigate();

  const contextValue = useMemo(() => {
    return { refreshData, setRefreshData };
  }, [refreshData]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setThisSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setThisSession(session);

      if (_event === "SIGNED_IN") {
        // catch the event of sign in to set the userId that we'll use everywhere in the app
        setUserId(session.user.id);
      }
      if (_event === "SIGNED_OUT") {
        // set the userId to null on sign out event to avoid side effect (have the userId of the previous session for example)
        setUserId(null);
        navigate("/"); // always return to "/" to avoid being on the route of a project that a user is not allowed to be part of
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!thisSession) {
    return <Connection />;
  }
  return (
    <div>
      <refreshContext.Provider value={contextValue}>
        <NavBar />
        <Outlet context={[userId]} />
      </refreshContext.Provider>
    </div>
  );
}
