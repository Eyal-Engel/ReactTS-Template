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
  const { theme, toggleTheme, darkMode } = useThemeCustomize();

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            height: "100vh",
            maxHeight: "100vh",
            width: "100vw",
            maxWidth: "100vw",
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
          <Box
            sx={{
              width: "inherit",
              height: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Outlet />
          </Box>
          <Box
            sx={{
              width: "inherit",
              alignSelf: "flex-end",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <SwitchMode darkMode={darkMode} toggleTheme={toggleTheme} />
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
