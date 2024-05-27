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
import { User } from "../../utils/types/types";
import { heIL } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import LockIcon from "@mui/icons-material/Lock";

import "./ManegeUsers.css";

export default function ManageExistsUsers() {
  const [rows, setRows] = useState<User[]>([]);
  const { user: loggedUser } = useAuth();
  const commands = [
    {
      id: "4cfd0d4c-5b0d-469a-a5a1-561d9d1a76de",
      commandName: "מרכז",
      isNewSource: false,
    },
    {
      id: "38dd4929-d496-4df7-824d-3fa01a640ca3",
      commandName: "ניהול",
      isNewSource: false,
    },
    {
      id: "f80a10ed-a0d3-40a3-9f06-2bbc14990a07",
      commandName: "צפון",
      isNewSource: false,
    },
  ];

  useEffect(() => {
    const fetchDataUsers = async () => {
      try {
        // Fetch users from the API
        const response = await fetch("http://localhost:5001/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const usersData = await response.json();
        console.log(usersData);
        // Update the state with the fetched users
        setRows(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchDataUsers();
  }, []);

  const handleDeleteClick = (id: string) => async () => {
    try {
      if (!loggedUser) return;

      if (id !== loggedUser.id) {
        const userToDelete = rows.find((row) => row.id === id);

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
  const sortedRows = [...rows].sort((a: User, b: User) => {
    return a.privateNumber.localeCompare(b.privateNumber);
  });

  return (
    <Box className="manage-users-container">
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
