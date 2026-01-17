import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";
import App from "./App.tsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#144b24", // rgb(20, 75, 36)
      light: "#2d7a42",
      dark: "#0d3218",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4b7c5a",
      light: "#6fa382",
      dark: "#36573f",
      contrastText: "#ffffff",
    },
  },
});

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    return worker.start({
      onUnhandledRequest: "bypass",
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>
  );
});
