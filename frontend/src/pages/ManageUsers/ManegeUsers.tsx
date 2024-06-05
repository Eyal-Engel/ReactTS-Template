import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import { useAuth } from "../../utils/hooks/useAuth";
import { Command, User } from "../../utils/types/types";
import { heIL } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import LockIcon from "@mui/icons-material/Lock";
import "./ManegeUsers.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteUser, getUsers } from "../../utils/api/usersApi";
import { Theme } from "@mui/material";
import { AxiosError } from "axios";
import { getCommands } from "../../utils/api/commandsApi";
import CustomNoRowsOverlay from "../../components/TableUtils/CustomNoRowsOverlay";
import { useTheme } from "@emotion/react";
import CostumErrorOverlay from "../../components/TableUtils/CostumErrorOverlay";
import CustomToolBarManageUsers from "../../components/TableUtils/costumToolBars/CustomToolBarManageUsers";
import { toast } from "react-toastify";
import SignupForm from "../../components/forms/SignupForm";
import { useState } from "react";
import {
  UserDialogProvider,
  useUserDialog,
} from "../../utils/contexts/userDialogContext";

export default function ManageUsers() {
  const { user: loggedUser } = useAuth();
  const queryClient = useQueryClient();
  const usersQuery = useQuery<User[]>(["users"], getUsers, { retry: 1 });
  const commandsQuery = useQuery<Command[]>(["commands"], getCommands);
  const theme = useTheme();
  const { open, setUserToEdit } = useUserDialog();

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      console.log(data.message);
      toast.success(data.message);
    },
    onError: (error: AxiosError) => {
      toast.error("לא ניתן למחוק את המשתמש");
    },
  });

  const handleEditClick = (id: GridRowId) => () => {
    const userToEdit: User | undefined = usersQuery.data?.find(
      (user) => user.id === id
    );

    if (!userToEdit) return;
    setUserToEdit(userToEdit);
    open();
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const userToDelete: User | undefined = usersQuery.data?.find(
      (user) => user.id === id
    );

    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete?.id);
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
            onClick={handleEditClick(id)}
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

  return (
    <Box className="manager_users_page">
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
        <SignupForm />
      </Box>
    </Box>
  );
}
