import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createCache, { StylisPlugin } from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import useThemeCustomize from "../../utils/hooks/useTheme";
import Header from "../../components/Header/Header";
import SwitchMode from "../../components/SwitchMode/SwitchMode";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [
    prefixer as unknown as StylisPlugin,
    rtlPlugin as unknown as StylisPlugin,
  ],
});

const RootLayout = () => {
  const { darkTheme, toggleDarkTheme, darkMode } = useThemeCustomize();

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
          <Header />
          <Box>
            <Outlet />
          </Box>
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
