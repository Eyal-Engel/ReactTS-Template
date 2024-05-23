import { Paper, Typography } from "@mui/material";

const ErrorNotFoundPage = () => {
  return (
    <Paper sx={{ p: 5, bgcolor: "GrayText" }}>
      <Typography variant="h4">העמוד שביקשת אינו קיים/דורש התחברות</Typography>
    </Paper>
  );
};

export default ErrorNotFoundPage;
