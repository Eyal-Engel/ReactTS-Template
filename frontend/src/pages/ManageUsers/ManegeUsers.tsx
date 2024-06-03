import * as React from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColTypeDef,
  GridRowId,
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
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
} from "../../utils/api/usersApi";
import { Button, Theme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { AxiosError } from "axios";
import { createCommand, getCommands } from "../../utils/api/commandsApi";
import CustomNoRowsOverlay from "../../components/TableUtils/CustomNoRowsOverlay";
import { useTheme } from "@emotion/react";
import CostumErrorOverlay from "../../components/TableUtils/CostumErrorOverlay";
import CustomToolBarManageUsers from "../../components/TableUtils/costumToolBars/CustomToolBarManageUsers";
import { toast } from "react-toastify";
import { UUID } from "crypto";

export default function ManageUsers() {
  const { user: loggedUser } = useAuth();
  const queryClient = useQueryClient();
  const usersQuery = useQuery<User[]>(["users"], getUsers, { retry: 1 });
  const commandsQuery = useQuery<Command[]>(["commands"], getCommands);
  const theme = useTheme();

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("משתמש נמחק בהצלחה");
    },
    onError: (error: AxiosError) => {
      toast.error("לא ניתן למחוק את המשתמש");
    },
  });

  const handleDeleteClick = (id: GridRowId) => async () => {
    // if (!loggedUser) return;
    console.log(id);
    // if (id !== loggedUser.id) {
    const userToDelete: User | undefined = usersQuery.data?.find(
      (user) => user.id === id
    );

    // if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete?.id);
    // }
    // else {
    // toast.error("ניתן למחוק את המשתמש שמחובר למערכת")
    // }
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
            onClick={handleDeleteClick(id)}
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

  console.log(usersQuery.data);
  return (
    <Box className="manager_users_page">
      {/* <LoadingButton
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
      </LoadingButton> */}
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
            toolbar: CustomToolBarManageUsers,
            noRowsOverlay: usersQuery.isError
              ? CostumErrorOverlay
              : CustomNoRowsOverlay,
          }}
          slotProps={{
            toolbar: {
              rows: sortedRows,
              columns,
              commands: commandsQuery.data || [],
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
