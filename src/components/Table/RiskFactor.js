/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import pxToRem from "assets/theme/functions/pxToRem";
import MDBox from "components/MDBox";
import { Colors } from "utils/Constants";

const RiskFactor = ({ risk }) => (
  <MDBox
    bgColor={
      (risk >= 12 && Colors.LIGHT_RED) ||
      (risk >= 6 && risk <= 12 && Colors.LIGHT_YELLOW) ||
      (risk <= 4 && Colors.LIGHT_GREEN)
    }
    color={
      (risk >= 12 && Colors.DARK_RED) ||
      (risk >= 6 && risk <= 12 && Colors.DARK_YELLOW) ||
      (risk <= 4 && Colors.DARK_GREEN)
    }
    variant="contained"
    borderRadius="16px"
    opacity={1}
    p={1}
    paddingX={pxToRem(16)}
    height="24px"
    textAlign="center"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    {risk}
  </MDBox>
);

export default RiskFactor;
