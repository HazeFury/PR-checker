import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

import "./App.css";
import Connection from "./pages/Connection/Connection";
import NavBar from "./components/App-components/Navbar/NavBar";
import supabase from "./services/client";

const theme = createTheme({
  palette: {
    button: {
      main: "rgb(56, 131, 186)",
      secondary: "rgb(186, 56, 56)",
      hover: "rgb(140, 34, 34)",
    },
    modal: {
      background: "rgb(62, 62, 62)",
    },
    text: {
      primary: "rgba(0, 0, 0, 0)",
      secondary: "rgb(255, 255, 255)",
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});
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
      <ThemeProvider theme={theme}>
        <NavBar />
        <Outlet />
      </ThemeProvider>
    </div>
  );
}
