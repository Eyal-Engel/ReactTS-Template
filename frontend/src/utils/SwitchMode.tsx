import { IconButton, useTheme } from "@mui/material";
import React from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

type SwitchModeProps = {
  darkMode: boolean;
  toggleDarkTheme: () => void;
};

// Define the functional component using TypeScript
const SwitchMode: React.FC<SwitchModeProps> = ({
  darkMode,
  toggleDarkTheme,
}) => {
  const theme = useTheme();
  return (
    <IconButton onClick={toggleDarkTheme} color="inherit">
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default SwitchMode;