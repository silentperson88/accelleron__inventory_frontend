/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material ui Components
import { Button } from "@mui/material";

// Custom function
import pxToRem from "assets/theme/functions/pxToRem";

// Constants
import { Icons, ButtonTitles } from "utils/Constants";

export default function ResetFilterButton({ handleReset }) {
  return (
    <Button
      sx={{
        mt: 5.5,
        mr: 1,
        backgroundColor: "#fff",
        "&:hover": {
          backgroundColor: "#fff",
        },
        fontSize: pxToRem(14),
        textTransform: "capitalize",
      }}
      variant="outlined"
      color="info"
      onClick={handleReset}
      startIcon={Icons.RESET_FILTER}
    >
      {ButtonTitles.RESET_FILTER}
    </Button>
  );
}
