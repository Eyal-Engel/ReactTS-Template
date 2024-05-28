import * as React from "react";
import Slide from "@mui/material/Slide";
import { SlideProps } from "@mui/material/Slide";

const Transition = React.forwardRef<unknown, SlideProps>(function Transition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default Transition;
