/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Superadmin from "assets/images/superadmin.svg";

const By = ({ name = "", when = "", isSuperAdmin = false }) => (
  <MDBox lineHeight={1} sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
    <MDBox lineHeight={1} sx={{ display: "flex", flexDirection: "row", alignItems: "left" }}>
      <MDTypography sx={{ textTransform: "capitalize" }} display="block" variant="caption">
        {name ?? ""}
      </MDTypography>
      <Tooltip title="Superadmin">
        <MDTypography variant="caption" sx={{ textTransform: "capitalize" }}>
          {isSuperAdmin && (
            <img
              src={Superadmin}
              alt="Preview"
              width={15}
              height={15}
              style={{ borderRadius: "8px", marginLeft: "5px" }}
            />
          )}
        </MDTypography>
      </Tooltip>
    </MDBox>
    <MDBox lineHeight={1}>
      <MDTypography
        sx={{ textTransform: "capitalize", fontSize: 14, color: "grey" }}
        display="block"
        variant="caption"
      >
        {when ?? ""}
      </MDTypography>
    </MDBox>
  </MDBox>
);

export default By;
