import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createCache, { StylisPlugin } from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import SwitchMode from "../../utils/SwitchMode";
import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [
    prefixer as unknown as StylisPlugin,
    rtlPlugin as unknown as StylisPlugin,
  ],
});

const RootLayout = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkTheme = () => {
    setDarkMode(!darkMode);
  };

  const darkTheme = createTheme({
    direction: "rtl",
    palette: {
      mode: darkMode ? "dark" : "light", // handle the dark mode state on toggle
      primary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.default",
            color: "text.primary",
            padding: "10px",
            paddingTop: "20px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Outlet />
          <SwitchMode darkMode={darkMode} toggleDarkTheme={toggleDarkTheme} />
          <Typography variant="body1" >
            פותח ע”י בית התוכנה - חיל הלוגיסטיקה
          </Typography>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default RootLayout;
