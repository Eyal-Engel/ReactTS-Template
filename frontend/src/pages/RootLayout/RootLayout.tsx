import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createCache, { StylisPlugin } from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import SwitchMode from "../../utils/SwitchMode";
import { Outlet } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  PaletteMode,
  PaletteOptions,
  Typography,
} from "@mui/material";
import logistic_corp_logo from "../../assets/pictures/logistic_corp_logo.png";
import mekalr_logo from "../../assets/pictures/mekalr_logo.png";
import useThemeCustomize from "../../utils/hooks/useTheme";
import SideBar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header";

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
