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
    fontFamily: '"Nunito", "Fredoka", sans-serif',
    h1: {
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Nunito", sans-serif',
    },
    body2: {
      fontFamily: '"Nunito", sans-serif',
    },
  },
})

