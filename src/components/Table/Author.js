/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const Author = ({
  name = "",
  icon = "",
  nickName = "",
  maxContent = 20,
  style = { textTransform: "capitalize" },
}) => {
  if (name && name.length > maxContent)
    return (
      <Tooltip title={name}>
        <MDTypography variant="caption" sx={{ textTransform: "capitalize" }}>
          {name.length > maxContent ? `${name.slice(0, maxContent)}...` : name}
        </MDTypography>
      </Tooltip>
    );

  return (
    <MDBox lineHeight={1} sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
      <MDBox lineHeight={1} sx={{ display: "flex", flexDirection: "row" }}>
        <MDTypography sx={style} display="block" variant="caption">
          {name ?? ""}
        </MDTypography>
        <MDTypography sx={style} display="block" variant="caption">
          {icon ?? ""}
        </MDTypography>
      </MDBox>
      <MDBox lineHeight={1}>
        <MDTypography
          sx={{ textTransform: "capitalize", fontSize: 14, color: "grey" }}
          display="block"
          variant="caption"
        >
          {nickName ?? ""}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default Author;
