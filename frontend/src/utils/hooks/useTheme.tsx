import { PaletteOptions, createTheme } from "@mui/material";
import { useMemo, useState } from "react";

const useThemeCustomize = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkTheme = () => {
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
    };
  };

  const darkTheme = useMemo(
    () =>
      createTheme({ direction: "rtl", palette: getThemeCustomized(darkMode) }),
    [darkMode]
  );

  return { darkTheme, toggleDarkTheme, darkMode };
};

export default useThemeCustomize;
