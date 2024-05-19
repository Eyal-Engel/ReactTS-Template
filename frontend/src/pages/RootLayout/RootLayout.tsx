import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createCache, { StylisPlugin } from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import SwitchMode from "../../utils/SwitchMode";
import { Outlet } from "react-router-dom";
import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import logistic_corp_logo from "../../assets/pictures/logistic_corp_logo.png";
import mekalr_logo from "../../assets/pictures/mekalr_logo.png";
import { Close, Menu } from "@mui/icons-material";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [
    prefixer as unknown as StylisPlugin,
    rtlPlugin as unknown as StylisPlugin,
  ],
});

const RootLayout = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [drawerMode, setDrawerMode] = useState(false);

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
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "100vw",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Drawer
              open={drawerMode}
              onClose={() => {
                setDrawerMode(false);
              }}
            >
              list
            </Drawer>
            <IconButton
              onClick={() => {
                setDrawerMode(!drawerMode);
              }}
            >
              {drawerMode ? <Close /> : <Menu />}
            </IconButton>
            <Box>
              <img src={mekalr_logo} alt="meklar" style={{ width: 100 }} />
              <img
                src={logistic_corp_logo}
                alt="logistic corp"
                style={{ width: 100 }}
              />
            </Box>
          </Box>
          <Outlet />

          <Box
            sx={{
              alignSelf: "flex-end",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <SwitchMode darkMode={darkMode} toggleDarkTheme={toggleDarkTheme} />
            <Typography variant="body1">
              פותח ע”י בית התוכנה - חיל הלוגיסטיקה
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default RootLayout;
