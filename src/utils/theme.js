import { createTheme } from "@mui/material"

export const theme = createTheme({
  palette: {
    primary: {
      main: "#9c2d40",
      dark: "#7a1f2f",
    },
    text: {
      primary: "#333",
      secondary: "#555",
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: '"Arial", sans-serif',
  },
}) 