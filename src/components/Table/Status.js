/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Colors, Icons } from "utils/Constants";

const Status = ({ title }) => {
  let icon;

  if (title === "open") {
    icon = Icons.CROSS3;
  } else if (title === "submitted") {
    icon = Icons.DASH;
  } else if (title === "closed") {
    icon = Icons.ACCEPT;
  } else {
    icon = (
      <Box
        component="span"
        backgroundColor={
          (title === "open" && "#9D0202") ||
          (title === "submitted" && "#ff6600") ||
          (title === "in discussion" && "#B68300") ||
          (title === "closed" && "#2A8C00") ||
          (title === "approved" && "#2A8C00") ||
          (title === "pending" && "#B68300") ||
          (title === "rejected" && "#9D0202")
        }
        sx={{
          borderRadius: "50%",
          width: "10px",
          height: "10px",
        }}
      />
    );
  }

  return (
    <MDBox
      bgColor={
        (title === "open" && "rgba(157, 2, 2, 0.1)") ||
        (title === "submitted" && "#ffefe5") ||
        (title === "in discussion" && "#f7f2e5") ||
        (title === "closed" && "rgba(42, 140, 0, 0.1)") ||
        (title === "approved" && "#DCF5E9") ||
        (title === "pending" && "#faf1e5") ||
        (title === "rejected" && "#FEE4E2")
      }
      color={
        (title === "open" && "#9D0202") ||
        (title === "submitted" && "#ff6600") ||
        (title === "in discussion" && "#B68300") ||
        (title === "closed" && "#2A8C00") ||
        (title === "approved" && "#029E3B") ||
        (title === "pending" && "#EB8D00") ||
        (title === "rejected" && "#BD382F")
      }
      variant="contained"
      borderRadius="16px"
      opacity={1}
      p={1}
      width={
        (title === "open" && "70px") ||
        (title === "submitted" && "105px") ||
        (title === "in discussion" && "130px") ||
        (title === "closed" && "80px") ||
        title === "approved" ||
        title === "pending" ||
        (title === "rejected" && "100px")
      }
      height="24px"
      textAlign="right"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      <Box
        sx={{
          width: "10px",
          height: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      <MDTypography
        ml={1}
        variant="caption"
        sx={{
          textTransform: "capitalize",
          color:
            (title === "open" && Colors.DARK_RED) ||
            (title === "submitted" && Colors.DARK_ORANGE) ||
            (title === "in discussion" && Colors.DARK_YELLOW) ||
            (title === "closed" && Colors.DARK_GREEN),
        }}
      >
        {title}
      </MDTypography>
    </MDBox>
  );
};

export default Status;
