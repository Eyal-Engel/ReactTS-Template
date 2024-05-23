import { IconButton } from "@mui/material";
import React from "react";
import DarkMode from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";

type SwitchModeProps = {
  darkMode: boolean;
  toggleDarkTheme: () => void;
};

// Define the functional component using TypeScript
const SwitchMode = ({ darkMode, toggleDarkTheme }: SwitchModeProps) => {
  return (
    <IconButton onClick={toggleDarkTheme} color="inherit">
      {darkMode ? <Brightness7Icon /> : <DarkMode />}
    </IconButton>
  );
};

export default SwitchMode;
