import { PaletteOptions, createTheme } from "@mui/material";
import { useMemo, useState } from "react";

const useThemeCustomize = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const getThemeCustomized = (darkMode: boolean): PaletteOptions => {
    return {
      mode: darkMode ? "dark" : "light",
      // primary: {
      //   main: darkMode ? '#002884' : "#757ce8",
      //   contrastText: '#fff',
      // },
      // secondary: {
      //   main: darkMode ? '#ba000d' : "#ff7961",
      //   contrastText: '#000',
      // },
      background: {
        default: darkMode ? "rgb(33,33,33)" : "#ffffff",
        paper: darkMode ? "rgb(48,48,48)" : "#ffffff",
      },
    };
  };

  const theme = useMemo(
    () =>
      createTheme({ direction: "rtl", palette: getThemeCustomized(darkMode) }),
    [darkMode]
  );

  return { theme, toggleTheme, darkMode };
};

export default useThemeCustomize;
