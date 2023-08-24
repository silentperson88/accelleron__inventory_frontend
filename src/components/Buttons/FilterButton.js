import { Button } from "@mui/material";
import pxToRem from "assets/theme/functions/pxToRem";

const filterButton = ({ title, icon, handleClick }) => (
  <Button
    sx={{
      mr: 2,
      mt: pxToRem(45),
      ml: 0,
      mb: 0,
      minWidth: 150,
      backgroundColor: "#fff",
      "&:hover": {
        backgroundColor: "#fff",
      },
      fontSize: pxToRem(14),
      textTransform: "capitalize",
      alignSelf: "flex-end",
    }}
    variant="outlined"
    color="info"
    onClick={handleClick}
    startIcon={icon}
  >
    {title}
  </Button>
);

export default filterButton;
