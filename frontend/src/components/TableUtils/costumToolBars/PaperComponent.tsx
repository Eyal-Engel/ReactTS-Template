import { Paper, PaperProps } from "@mui/material";
import React from "react";
import Draggable from "react-draggable";

const PaperComponent: React.FC<PaperProps> = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} sx={{ borderRadius: "10px" }} />
    </Draggable>
  );
};

export default PaperComponent;
