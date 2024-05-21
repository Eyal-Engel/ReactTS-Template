import { Button, Card, Paper, TextField, Typography } from "@mui/material";
import React from "react";

const ErrorNotFoundPage = () => {
  return (
    <Paper sx={{p: 5, bgcolor: "GrayText"}}>
      <Typography variant="h4">העמוד שביקשת אינו קיים/דורש התחברות</Typography>

    </Paper>
  );
};

export default ErrorNotFoundPage;
