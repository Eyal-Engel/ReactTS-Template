import React, { forwardRef } from "react";
import { Paper, PaperProps } from "@mui/material";

// Forward ref properly and ensure types are correctly set
const PaperComponent = forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
  return <Paper ref={ref} {...props} />;
});

export default PaperComponent;
