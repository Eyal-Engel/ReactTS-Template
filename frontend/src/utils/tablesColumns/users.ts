// import React from "react";
// import {
//   GridColDef,
//   GridActionsCellItem,
//   GridRenderCellParams,
//   GridValueGetterParams,
// } from "@mui/x-data-grid";
// import EditIcon from "@mui/icons-material/Edit";
// import LockIcon from "@mui/icons-material/Lock";
// import DeleteIcon from "@mui/icons-material/Delete";

// interface Command {
//   value: string;
//   label: string;
// }

// interface RowModesModel {
//   [key: string]: { mode: string };
// }

// const commands: Command[] = [];

// const rowModesModel: RowModesModel = {};

// const handleSaveClick = (id: string) => {};
// const handleCancelClick = (id: string) => {};
// const handleEditClick = (id: string) => {};
// const handleResetPassword = (id: string) => {};
// const handleDeleteClick = (id: string) => {};

// export const columns: GridColDef[] = [
//   {
//     field: "privateNumber",
//     headerName: "מספר אישי",
//     headerAlign: "center",
//     align: "center",
//     type: "string",
//     editable: true,
//     flex: 1,
//   },
//   {
//     field: "fullName",
//     headerName: "שם מלא",
//     headerAlign: "center",
//     type: "string",
//     editable: true,
//     flex: 1,
//     align: "center",
//   },
//   {
//     field: "commandName",
//     headerName: "פיקוד",
//     headerAlign: "center",
//     type: "singleSelect",
//     align: "center",
//     editable: true,
//     flex: 1,
//     valueOptions: commands,
//     valueFormatter: ({ value }: { value: string }) => {
//       const option = commands.find(
//         ({ value: optionValue }) => optionValue === value
//       );
//       return option ? option.label : value;
//     },
//   },
//   {
//     field: "editPerm",
//     headerName: "הרשאות עריכה",
//     headerAlign: "center",
//     type: "boolean",
//     editable: true,
//     flex: 1,
//     valueGetter: (params: GridValueGetterParams) => params.value as boolean,
//     renderCell: (params: GridRenderCellParams<boolean>) =>
//       params.value ? (
//         <span style={{ color: "green", fontSize: "1.2rem" }}>✓</span>
//       ) : (
//         <span style={{ color: "red", fontSize: "1.2rem" }}>✗</span>
//       ),
//   },
//   {
//     field: "managePerm",
//     headerName: "הרשאות ניהול",
//     headerAlign: "center",
//     type: "boolean",
//     editable: true,
//     flex: 1,
//     valueGetter: (params: GridValueGetterParams) => params.value as boolean,
//     renderCell: (params: GridRenderCellParams<boolean>) =>
//       params.value ? (
//         <span style={{ color: "green", fontSize: "1.2rem" }}>✓</span>
//       ) : (
//         <span style={{ color: "red", fontSize: "1.2rem" }}>✗</span>
//       ),
//   },
//   {
//     field: "roles",
//     headerName: "Roles",
//     headerAlign: "center",
//     type: "string",
//     editable: true,
//     flex: 1,
//     align: "center",
//     valueGetter: (params) => {
//       const roles = params.row.roles || [];
//       return roles.join(", ");
//     },
//   },
//   {
//     field: "actions",
//     type: "actions",
//     headerName: "פעולות",
//     headerAlign: "center",
//     flex: 1.5,
//     cellClassName: "actions",
//     getActions: ({ id }: { id: string }) => [
//       <GridActionsCellItem
//         icon={<EditIcon />}
//         label="Edit"
//         className="textPrimary"
//         onClick={() => handleEditClick(id)}
//         color="primary"
//       />,
//       <GridActionsCellItem
//         icon={<LockIcon />}
//         label="ResetPassword"
//         onClick={() => handleResetPassword(id)}
//         color="gray"
//       />,
//       <GridActionsCellItem
//         icon={<DeleteIcon />}
//         label="Delete"
//         onClick={() => handleDeleteClick(id)}
//         color="error"
//       />,
//     ],
//   },
// ];

export {};
