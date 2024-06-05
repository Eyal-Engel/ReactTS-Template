import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Transition from "../TableUtils/costumToolBars/Transition";
import { useForm, Controller } from "react-hook-form";
import { Command, User } from "../../utils/types/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createUser, deleteUser } from "../../utils/api/usersApi";
import { toast } from "react-toastify";
import { IoIosClose } from "react-icons/io";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import { getCommands } from "../../utils/api/commandsApi";
import PaperComponent from "../TableUtils/costumToolBars/PaperComponent";
import { useUserDialog } from "../../utils/contexts/userDialogContext";

type SignupFormProps = {
  // openCreateNewUser: boolean;
  // setOpenCreateNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  // userToEdit?: User;
};
function SignupForm({}: // openCreateNewUser,
// setOpenCreateNewUser,
// userToEdit,
SignupFormProps) {
  const { openUserDialog, close, userToEdit } = useUserDialog();
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
  } = useForm<User>({
    defaultValues: {
      privateNumber: userToEdit ? userToEdit.privateNumber : "",
      // commandId: userToEdit ? userToEdit.commandId : undefined,
      editPerm: userToEdit ? userToEdit.editPerm : false,
      managePerm: userToEdit ? userToEdit.managePerm : false,
      fullName: userToEdit ? userToEdit.fullName : "",
    },
  });

  useEffect(() => {
    reset({
      privateNumber: userToEdit ? userToEdit.privateNumber : "",
      // commandId: userToEdit ? userToEdit.commandId : undefined,
      editPerm: userToEdit ? userToEdit.editPerm : false,
      managePerm: userToEdit ? userToEdit.managePerm : false,
      fullName: userToEdit ? userToEdit.fullName : "",
    });
  }, [userToEdit, reset]);

  const newUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User created successfully");
      handleClose();
    },
    onError: (error: Error, variables: User) => {
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
    close();
    reset();
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue("editPerm", value === "editPerm");
    setValue("managePerm", value === "managePerm");
  };
  console.log(userToEdit);
  return (
    <Dialog
      open={openUserDialog}
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
                {...register("privateNumber", {
                  required: "שדה חובה",
                  pattern: {
                    value: /^\d{7}$/,
                    message: ` הכנס מספר אישי בעל 7 ספרות `,
                  },
                })}
                label="מספר אישי *"
                id="privateNumber"
                size="medium"
              />
              {errors.privateNumber && (
                <Typography variant="body2" color="error">
                  {errors.privateNumber.message}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                {...register("fullName", {
                  required: "שדה חובה",
                })}
                label="שם מלא *"
                id="fullName"
                size="medium"
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
                defaultValue={userToEdit ? userToEdit.commandId : undefined}
                render={({ field }) => (
                  <Autocomplete<Command>
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

            {!userToEdit && (
              <FormControl fullWidth>
                <TextField
                  {...register("password", {
                    required: "שדה חובה",
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                      message:
                        "סיסמה חייבת להכיל לפחות ספרה אחת ואות אחת ולהיות באורך של לפחות 6 תווים",
                    },
                  })}
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
                />
                {errors.password && (
                  <Typography variant="body2" color="error">
                    {errors.password.message}
                  </Typography>
                )}
              </FormControl>
            )}
            {!userToEdit && (
              <FormControl fullWidth>
                <TextField
                  {...register("confirmPassword", {
                    required: "שדה חובה",
                    validate: (value) =>
                      value === watch("password") ||
                      "אימות הסיסמה אינו תואם את הסיסמה",
                  })}
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
                />
                {errors.confirmPassword && (
                  <Typography variant="body2" color="error">
                    {errors.confirmPassword.message}
                  </Typography>
                )}
              </FormControl>
            )}
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
