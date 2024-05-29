import * as React from "react";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { AxiosError } from "axios";
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
  InputAdornment,
  IconButton,
  InputLabel,
  Box,
  Typography,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import AddIcon from "@mui/icons-material/Add";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../../../utils/hooks/useAuth";
import { createUser, getUsers } from "../../../utils/api/usersApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Transition from "./Transition";
import PaperComponent from "./PaperComponent";
import { Command, User } from "../../../utils/types/types";

interface CustomToolBarManageUsersProps {
  setRows: React.Dispatch<React.SetStateAction<any[]>>;
  rows: any[];
  columns: any[];
  commands: Command[];
  darkMode: boolean;
}

export default function CustomToolBarManageUsers({
  rows,
  columns,
  commands,
  darkMode,
}: CustomToolBarManageUsersProps) {
  const [openCreateNewUser, setOpenCreateNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user: loggedUser } = useAuth();
  const queryClient = useQueryClient();
  const usersQuery = useQuery<User[]>(["users"], getUsers, { retry: 1 });

  const newUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries(["users"]),
    onError: (error: AxiosError, variables: User) => {
      console.log(
        "an error occurred: " +
          error.message +
          " with user: " +
          variables.fullName
      );
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<User>();

  const password = watch("password");

  const handleClose = () => {
    setOpenCreateNewUser(false);
  };

  const handleCreateUser = (formData: User) => {
    console.log(formData);
    newUserMutation.mutate(formData);

    console.log(newUserMutation.isSuccess);
    if (newUserMutation.isSuccess) {
      toast.success("User created successfully");
    } else {
      toast.error("Failed to create new user");
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        draggable={false}
        hideProgressBar={true}
        pauseOnHover={true}
        closeOnClick={true}
        closeButton={false}
        className={darkMode ? "toastify-dark" : "toastify-light"}
      />
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
          <Button color="primary" startIcon={<SaveAltIcon />}>
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
        <form onSubmit={handleSubmit(handleCreateUser)}>
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
              <IconButton color="primary" onClick={handleClose}>
                <IoIosClose style={{ transform: "scale(2)" }} />
              </IconButton>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth>
                <TextField
                  label="מספר אישי *"
                  id="privateNumber"
                  size="medium"
                  {...register("privateNumber", {
                    required: "שדה חובה",
                    pattern: {
                      value: /^\d{7}$/,
                      message: ` הכנס מספר אישי בעל 7 ספרות `,
                    },
                  })}
                  helperText={
                    errors.privateNumber && (
                      <Typography variant="body2" color="error">
                        {errors.privateNumber.message}
                      </Typography>
                    )
                  }
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="שם מלא *"
                  id="fullName"
                  size="medium"
                  {...register("fullName", {
                    required: "שדה חובה",
                  })}
                  helperText={
                    errors.fullName && (
                      <Typography variant="body2" color="error">
                        {errors.fullName.message}
                      </Typography>
                    )
                  }
                />
              </FormControl>
              <FormControl fullWidth>
                {/* <InputLabel id="commandId-label">פיקוד</InputLabel> */}

                <Controller
                  control={control}
                  {...register("commandId", {
                    required: "שדה חובה",
                  })}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      id="commandId"
                      options={commands}
                      getOptionLabel={(option) => option.name}
                      onChange={(__, newValue) => {
                        onChange(newValue ? newValue.id : null);
                      }}
                      value={
                        commands.find((command) => command.id === value) || null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="פיקוד *"
                          variant="outlined"
                          helperText={
                            errors.command && (
                              <Typography variant="body2" color="error">
                                {errors.command.message}
                              </Typography>
                            )
                          }
                        />
                      )}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  label="סיסמה *"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  size="medium"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register("password", {
                    required: "שדה חובה",
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                      message:
                        "סיסמה חייבת להכיל לפחות ספרה אחת ואות אחת ולהיות באורך של לפחות 6 תווים",
                    },
                  })}
                  helperText={
                    errors.password && (
                      <Typography variant="body2" color="error">
                        {errors.password.message}
                      </Typography>
                    )
                  }
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="אימות סיסמה *"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  size="medium"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleConfirmPasswordVisibility}>
                          {showConfirmPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register("confirmPassword", {
                    required: "שדה חובה",
                    validate: (value) =>
                      value === password || "אימות הסיסמה אינו תואם את הסיסמה",
                  })}
                  helperText={
                    errors.confirmPassword && (
                      <Typography variant="body2" color="error">
                        {errors.confirmPassword.message}
                      </Typography>
                    )
                  }
                />
              </FormControl>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">הרשאות</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox {...register("editPerm")} />}
                    label="הרשאת עריכה"
                  />
                  <FormControlLabel
                    control={<Checkbox {...register("managePerm")} />}
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
                sx={{ borderRadius: "5000px" }}
              >
                בטל
              </Button>
              <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={newUserMutation.isLoading}
                sx={{ borderRadius: "5000px" }}
              >
                צור משתמש
              </LoadingButton>
            </Box>
          </Box>
        </form>
      </Dialog>
    </>
  );
}
