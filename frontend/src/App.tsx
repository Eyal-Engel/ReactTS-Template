//App.js

import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Card,
  CardContent,
  CardMedia,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import createCache, { StylisPlugin } from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [
    prefixer as unknown as StylisPlugin,
    rtlPlugin as unknown as StylisPlugin,
  ],
});
export default function App() {
  const [toggleDarkMode, setToggleDarkMode] = useState(true);

  const toggleDarkTheme = () => {
    setToggleDarkMode(!toggleDarkMode);
  };

  const darkTheme = createTheme({
    direction: "rtl",
    palette: {
      mode: toggleDarkMode ? "dark" : "light", // handle the dark mode state on toggle
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

        <h2>Toggle Dark mode</h2>
        <Switch checked={toggleDarkMode} onChange={toggleDarkTheme} />
        {/* rendering the card component with card content */}
        <Card sx={{ width: "30%", borderRadius: 3, padding: 1 }}>
          <CardContent>
            <CardMedia
              sx={{ height: 180, borderRadius: 3 }}
              image="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
              title="semaphore"
            />
            <Typography variant="h4" component="div" sx={{ marginTop: 3 }}>
              תכנות "בית התוכנה"
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              ע"י גיא לוי ואייל אנגל
            </Typography>
            <Typography variant="body1">
              אנחנו בית התכונה של חיל הלוגיסטיקה, מפתחים מערכות בreact, js,
              node.
            </Typography>
          </CardContent>
        </Card>
        <TextField sx={{ mt: 2 }} label="ניסיון"></TextField>
      </ThemeProvider>
    </CacheProvider>
  );
}
