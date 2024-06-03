import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Transition from "../TableUtils/costumToolBars/Transition";
import { useForm, Controller } from "react-hook-form";
import { Command, User } from "../../utils/types/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createUser, deleteUser } from "../../utils/api/usersApi";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { IoIosClose } from "react-icons/io";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import { getCommands } from "../../utils/api/commandsApi";
import PaperComponent from "../TableUtils/costumToolBars/PaperComponent";
import { Compare } from "@mui/icons-material";
import { error } from "console";
type SignupFormProps = {
  openCreateNewUser: boolean;
  setOpenCreateNewUser: React.Dispatch<React.SetStateAction<boolean>>;
};
function SignupForm({
  openCreateNewUser,
  setOpenCreateNewUser,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const queryClient = useQueryClient();
  const commandsQuery = useQuery<Command[]>(["commands"], getCommands);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<User>();

  const newUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User created successfully");
      handleClose();
      reset();
    },
    onError: (error: AxiosError, variables: User) => {
      toast.error(`לא ניתן ליצור את המשתמש`);
    },
  });

  // const deleteUserMutation = useMutation({
  //   mutationFn: deleteUser,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["users"]);
  //     toast.success("משתמש נמחק בהצלחה");
  //     handleClose();
  //   },
  //   onError: (error: AxiosError) => {
  //     toast.error("לא ניתן למחוק את המשתמש");
  //   },
  // });

  const handleCreateUser = (formData: User) => {
    console.log(formData);
    newUserMutation.mutate(formData);
  };
  const handleClose = () => {
    setOpenCreateNewUser(false);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue("editPerm", value === "editPerm");
    setValue("managePerm", value === "managePerm");
  };
  return (
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
          <Divider sx={{ mb: 2 }} />
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
              />
              {errors.privateNumber && (
                <Typography variant="body2" color="error">
                  {errors.privateNumber.message}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="שם מלא *"
                id="fullName"
                size="medium"
                {...register("fullName", {
                  required: "שדה חובה",
                })}
              />
              {errors.fullName && (
                <Typography variant="body2" color="error">
                  {errors.fullName.message}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth>
              <Controller
                name="commandId"
                control={control}
                rules={{ required: "שדה חובה" }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={
                      commandsQuery.data?.find(
                        (command) => command.id === field.value
                      ) || null
                    }
                    options={commandsQuery.data || []}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField {...params} label="פיקוד" variant="outlined" />
                    )}
                    onChange={(_, data) => field.onChange(data?.id)}
                  />
                )}
              />
              {errors.commandId && (
                <Typography variant="body2" color="error">
                  {errors.commandId.message}
                </Typography>
              )}
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
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
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
              />
              {errors.password && (
                <Typography variant="body2" color="error">
                  {errors.password.message}
                </Typography>
              )}
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
                      <IconButton
                        onClick={() => {
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                      >
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
                    value === watch("password") ||
                    "אימות הסיסמה אינו תואם את הסיסמה",
                })}
              />
              {errors.confirmPassword && (
                <Typography variant="body2" color="error">
                  {errors.confirmPassword.message}
                </Typography>
              )}
            </FormControl>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">הרשאות</FormLabel>
              <RadioGroup row onChange={handleRadioChange}>
                <Controller
                  name="editPerm"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Radio
                          checked={field.value}
                          {...field}
                          value="editPerm"
                        />
                      }
                      label="הרשאת עריכה"
                    />
                  )}
                />
                <Controller
                  name="managePerm"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Radio
                          checked={field.value}
                          {...field}
                          value="managePerm"
                        />
                      }
                      label="הרשאת ניהול"
                    />
                  )}
                />
              </RadioGroup>
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
            {/* <LoadingButton
              variant="contained"
              color="error"
              loading={deleteUserMutation.isLoading}
              sx={{ borderRadius: "5000px" }}
            >
              מחק משתמש
            </LoadingButton> */}
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
  );
}

export default SignupForm;
