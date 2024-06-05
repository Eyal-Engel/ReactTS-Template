import * as React from "react";
import { useState } from "react";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignupForm from "../../forms/SignupForm";
import { useUserDialog } from "../../../utils/contexts/userDialogContext";

interface CustomToolBarManageUsersProps {
  darkMode: boolean;
}

export default function CustomToolBarManageUsers({
  darkMode,
}: CustomToolBarManageUsersProps) {
  const { open } = useUserDialog();

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
      <Button color="primary" startIcon={<AddIcon />} onClick={open}>
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
    </>
  );
}
