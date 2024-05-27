import { Box } from "@mui/material";
import React, { ReactElement } from "react";
// import StyledGridOverlay from "./StyledGridOverlay";

export default function CustomNoRowsOverlay(): ReactElement {
  return (
    // <StyledGridOverlay>
    <>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      ></svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </>
    // </StyledGridOverlay>
  );
}
