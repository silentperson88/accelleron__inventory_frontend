/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Components
import { Box } from "@mui/material";

// Material Common Components
import pxToRem from "assets/theme/functions/pxToRem";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Utils
import Constants, { Colors, Icons } from "utils/Constants";

const titleDimensions = {
  [Constants.DAMAGED]: { bgColor: Colors.LIGHT_RED, color: Colors.DARK_RED, width: "70px" },
  [Constants.IN_USE]: {
    bgColor: Colors.LIGHT_ORANGE,
    color: Colors.DARK_ORANGE,
    width: pxToRem(105),
  },
  [Constants.IN_REPAIR]: {
    bgColor: Colors.LIGHT_YELLOW,
    color: Colors.DARK_YELLOW,
    width: pxToRem(130),
  },
  [Constants.AVAILABLE]: { bgColor: Colors.LIGHT_GREEN, color: Colors.DARK_GREEN, width: "100px" },
};

const Status = ({ title }) => {
  const { bgColor, color, width } = titleDimensions[title] || {};

  let icon;
  switch (title) {
    case Constants.STATUS_REJECTED:
    case Constants.OPEN:
      icon = Icons.CROSS3;
      break;
    case Constants.STATUS_PENDING:
      icon = Icons.WARNING;
      break;
    case Constants.SUBMITTED:
      icon = Icons.DASH;
      break;
    case Constants.CLOSED:
    case Constants.APPROVED:
    case Constants.CHECK_IN:
      icon = Icons.ACCEPT;
      break;
    default:
      icon = (
        <Box
          component="span"
          backgroundColor={color}
          sx={{
            borderRadius: "50%",
            width: pxToRem(10),
            height: pxToRem(10),
          }}
        />
      );
      break;
  }

  return (
    <MDBox
      bgColor={bgColor}
      color={color}
      variant="contained"
      borderRadius={pxToRem(16)}
      opacity={1}
      p={1}
      width={width}
      height={pxToRem(24)}
      textAlign="right"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      <Box
        sx={{
          width: pxToRem(10),
          height: pxToRem(10),
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
          color,
        }}
      >
        {title}
      </MDTypography>
    </MDBox>
  );
};

export default Status;
