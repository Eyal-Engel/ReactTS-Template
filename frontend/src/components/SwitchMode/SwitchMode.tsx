import { IconButton } from "@mui/material";
import React from "react";
import DarkMode from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";

type SwitchModeProps = {
  darkMode: boolean;
  toggleTheme: () => void;
};

// Define the functional component using TypeScript
const SwitchMode = ({ darkMode, toggleTheme }: SwitchModeProps) => {
  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {darkMode ? <Brightness7Icon /> : <DarkMode />}
    </IconButton>
  );
};

export default SwitchMode;
