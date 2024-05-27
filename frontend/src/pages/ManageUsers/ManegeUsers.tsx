import * as React from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColTypeDef,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useAuth } from "../../utils/hooks/useAuth";
import { Command, User } from "../../utils/types/types";
import { heIL } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import LockIcon from "@mui/icons-material/Lock";
import "./ManegeUsers.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createUser, getUserById, getUsers } from "../../utils/api/usersApi";
import { Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { AxiosError } from "axios";
import { createCommand, getCommands } from "../../utils/api/commandsApi";

export default function ManageUsers() {
  const { user: loggedUser } = useAuth();
  const queryClient = useQueryClient();
  const usersQuery = useQuery<User[]>(["users"], getUsers);
  const commandsQuery = useQuery<Command[]>(["commands"], getCommands);

  // Define userId or fetch it from somewhere
  // const userId = "85bdabba-2e51-4406-a1e6-70f142b27d15"; // Example userId

  // const userByIdQuery = useQuery<User>(
  //   ["user", userId], // userId should be defined
  //   () => getUserById(userId)
  // );

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

  const newCommandMutation = useMutation({
    mutationFn: createCommand,
    onSuccess: () => queryClient.invalidateQueries(["commands"]),
    onError: (error: AxiosError, command: Command) => {
      console.log(
        "an error occurred: " + error.message + " with user: " + command.name
      );
    },
  });

  const handleDeleteClick = (id: string) => async () => {
    try {
      if (!loggedUser) return;

      if (id !== loggedUser.id) {
        const userToDelete = usersQuery.data?.find((row) => row.id === id);

        if (!userToDelete) return;

        const { fullName } = userToDelete;

        const result = await Swal.fire({
          title: `האם את/ה בטוח/ה שתרצה/י למחוק את המשתמש ${fullName}`,
          text: "פעולה זאת איננה ניתנת לשחזור",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "מחק משתמש",
          cancelButtonText: "בטל",
          reverseButtons: true,
          customClass: {
            container: "swal-dialog-custom",
          },
        });

        if (result.isConfirmed) {
          // Delete user here
          await Swal.fire({
            title: `משתמש "${fullName}" נמחק בהצלחה!`,
            icon: "success",
            confirmButtonText: "אישור",
            customClass: {
              container: "swal-dialog-custom",
            },
          });
        }
      } else {
        await Swal.fire({
          title: `לא ניתן למחוק את המשתמש`,
          text: "משתמש אינו יכול למחוק את עצמו",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "אישור",
          reverseButtons: true,
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns: GridColDef<User>[] = [
    {
      field: "privateNumber",
      headerName: "מספר אישי",
      headerAlign: "center",
      align: "center",
      type: "string",
      editable: true,
      flex: 1,
    },

    {
      field: "fullName",
      headerName: "שם מלא",
      headerAlign: "center",
      type: "string",
      editable: true,
      flex: 1,
      align: "center",
    },

    {
      field: "commandName",
      headerName: "פיקוד",
      headerAlign: "center",
      type: "singleSelect",
      align: "center",
      editable: true,
      flex: 1,
      // valueOptions: commands,
      // valueFormatter: ({ value }) => {
      //   const option = commands.find(({ commandName }) => commandName === value);
      //   return option ? option.commandName : value;
    },

    {
      field: "editPerm",
      headerName: "הרשאות עריכה",
      headerAlign: "center",
      type: "boolean",
      editable: true,
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <span style={{ color: "green", fontSize: "1.2rem" }}>✓</span>
        ) : (
          <span style={{ color: "red", fontSize: "1.2rem" }}>✗</span>
        ),
    },
    {
      field: "managePerm",
      headerName: "הרשאות ניהול",
      headerAlign: "center",
      type: "boolean",
      editable: true,
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <span style={{ color: "green", fontSize: "1.2rem" }}>✓</span>
        ) : (
          <span style={{ color: "red", fontSize: "1.2rem" }}>✗</span>
        ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "פעולות",
      headerAlign: "center",
      flex: 1.5,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            color="primary"
          />,
          <GridActionsCellItem
            icon={<LockIcon />}
            label="ResetPassword"
            showInMenu={false}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            color="error"
          />,
        ];
      },
    },
  ];

  // Sorting rows
  const sortedRows = [...(usersQuery.data || [])].sort((a: User, b: User) => {
    return a.privateNumber.localeCompare(b.privateNumber);
  });

  const newUser: User = {
    fullName: "guy",
    privateNumber: "2222222",
    password: "123",
    commandId: "38dd4929-d496-4df7-824d-3fa01a640ca3",
    editPerm: true,
    managePerm: true,
  };

  //|| userByIdQuery.isLoading
  if (usersQuery.isFetching || commandsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  //|| userByIdQuery.isError
  if (usersQuery.isError || commandsQuery.isError) {
    return <div>Error fetching data</div>;
  }

  console.log(commandsQuery.data);
  return (
    <Box className="manage-users-container">
      <LoadingButton
        variant="contained"
        color="primary"
        loading={newUserMutation.isLoading}
        onClick={() => newUserMutation.mutate(newUser)}
      >
        create user
      </LoadingButton>
      <LoadingButton
        variant="contained"
        color="primary"
        loading={newCommandMutation.isLoading}
        onClick={() =>
          newCommandMutation.mutate({
            name: "trololol",
            isNewSource: true,
          })
        }
      >
        create command
      </LoadingButton>
      <DataGrid
        rows={sortedRows}
        columns={columns}
        editMode="row"
        localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
        pageSizeOptions={[5, 10, 25, 100]}
      />
    </Box>
  );
}
