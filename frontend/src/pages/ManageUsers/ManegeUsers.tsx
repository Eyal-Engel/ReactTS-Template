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
import { Button, Theme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { AxiosError } from "axios";
import { createCommand, getCommands } from "../../utils/api/commandsApi";
import CustomNoRowsOverlay from "../../components/TableUtils/CustomNoRowsOverlay";
import { useTheme } from "@emotion/react";
import CostumErrorOverlay from "../../components/TableUtils/CostumErrorOverlay";

export default function ManageUsers() {
  const { user: loggedUser } = useAuth();
  const queryClient = useQueryClient();
  const usersQuery = useQuery<User[]>(["users"], getUsers, { retry: 1 });
  const commandsQuery = useQuery<Command[]>(["commands"], getCommands);
  const theme = useTheme();

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
      field: "command",
      headerName: "פיקוד",
      headerAlign: "center",
      align: "center",
      editable: true,
      flex: 1,
      valueFormatter: ({ value }) => {
        return value.name;
      },
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
    commandId: "736ac3b2-87d5-4f42-9619-17867915f619",
    editPerm: true,
    managePerm: true,
  };

  console.log(commandsQuery.data);
  console.log(usersQuery);
  return (
    <Box className="manager_users_page">
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
      <Box
        className="manage-users-container"
        sx={{
          background: "background.default",
          borderRadius: "2rem",
          boxShadow: "5px 5px 31px 5px rgba(0, 0, 0, 0.75)",
        }}
      >
        <DataGrid
          rows={sortedRows}
          columns={columns}
          loading={!usersQuery.isError && usersQuery.isLoading}
          localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
          pageSizeOptions={[5, 10, 25, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          slots={{
            noRowsOverlay: usersQuery.isError
              ? CostumErrorOverlay
              : CustomNoRowsOverlay,
          }}
          slotProps={{
            toolbar: {
              sortedRows,
              columns,
              commands: commandsQuery.data,
            },
          }}
          sx={{
            border: "none",
            "& .MuiButton-textSizeSmall": {},
            "& .MuiDataGrid-columnHeadersInner": {
              bgcolor: (theme as Theme).palette.primary.main,
            },
          }}
        />
      </Box>
    </Box>
  );
}
