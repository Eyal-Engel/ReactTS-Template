import { Box } from "@mui/material";
import SideBar from "../SideBar/SideBar";
import logistic_corp_logo from "../../assets/pictures/logistic_corp_logo.png";
import mekalr_logo from "../../assets/pictures/mekalr_logo.png";
function Header() {
  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <SideBar />

      <Box>
        <img src={mekalr_logo} alt="meklar" style={{ width: 100 }} />
        <img
          src={logistic_corp_logo}
          alt="logistic corp"
          style={{ width: 100 }}
        />
      </Box>
    </Box>
  );
}

export default Header;
