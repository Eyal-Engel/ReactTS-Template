import * as React from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  Dialog,
  Button,
  TextField,
  Select,
  MenuItem,
  FormLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  SelectChangeEvent,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";

import AddIcon from "@mui/icons-material/Add";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Transition from "./Transition";
import PaperComponent from "./PaperComponent";
import { useState } from "react";
import { Command } from "../../../utils/types/types";
import { useForm } from "react-hook-form";

interface CustomToolBarManageUsersProps {
  setRows: React.Dispatch<React.SetStateAction<any[]>>;
  rows: any[];
  columns: any[];
  commands: Command[];
}

interface UserSignUpInfo {
  privateNumber: string;
  fullName: string;
  password: string;
  command: string;
  confirmPassword: string;
  editPerm: boolean;
  managePerm: boolean;
}

export default function CustomToolBarManageUsers({
  rows,
  columns,
  commands,
}: CustomToolBarManageUsersProps) {
  const [openCreateNewUser, setOpenCreateNewUser] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClose = () => {
    setOpenCreateNewUser(false);
  };

  return (
    <>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenCreateNewUser(true)}
      >
        צור משתמש חדש
      </Button>
      <GridToolbarContainer
        style={{
          justifyContent: "space-between",
        }}
      >
        <div>
          <GridToolbarColumnsButton color="primary" />
          <GridToolbarFilterButton color="primary" />
          <GridToolbarDensitySelector color="primary" />
          <Button
            color="primary"
            startIcon={<SaveAltIcon />}
            // onClick={handleExportToExcel}
          >
            יצא ל-Excel
          </Button>
        </div>
        <GridToolbarQuickFilter color="primary" />
      </GridToolbarContainer>

      <Dialog
        open={openCreateNewUser}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        TransitionComponent={Transition}
        transitionDuration={500}
      >
        <Box className="create-user-dialog" sx={{ padding: "5px 10px" }}>
          <Box
            className="create-user-dialog-header"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5"> יצירת משתמש חדש</Typography>
            <Button
              color="primary"
              startIcon={
                <IoIosClose
                  style={{
                    transform: "scale(2)",
                  }}
                />
              }
              onClick={handleClose}
            />
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <TextField
                label="מספר אישי"
                id="privateNumber"
                size="medium"
                {...register("privateNumber", {
                  required: {
                    value: true,
                    message: "מספר אישי שדה חובה",
                  },
                  pattern: {
                    value: /^\d{7}$/,
                    message: ` הכנס מספר אישי בעל 7 ספרות `,
                  },
                })}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="שם מלא"
                id="fullName"
                size="medium"
                {...register("fullName", {
                  required: {
                    value: true,
                    message: "שם מלא שדה חובה",
                  },
                })}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="command-label">פיקוד</InputLabel>

              <Select
                labelId="command-label"
                id="command-label"
                name="command"
                displayEmpty
                size="medium"
                label="פיקוד"
              >
                {commands.map((command: Command, index) => (
                  <MenuItem key={command.id} value={command.id}>
                    {command.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="סיסמה"
                id="password"
                type="password"
                size="medium"
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="אימות סיסמה"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                size="medium"
              />
            </FormControl>

            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">הרשאות</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox name="editPerm" />}
                  label="הרשאת עריכה"
                />
                <FormControlLabel
                  control={<Checkbox name="managePerm" />}
                  label="הרשאת ניהול"
                />
              </FormGroup>
            </FormControl>
          </Box>
          <Divider sx={{ margin: "20px 0" }} />

          <Box
            className="create-user-dialog-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              onClick={handleClose}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: "5000px",
                marginRight: "10px",
              }}
            >
              בטל
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              sx={{
                borderRadius: "5000px",
              }}
            >
              צור משתמש
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
