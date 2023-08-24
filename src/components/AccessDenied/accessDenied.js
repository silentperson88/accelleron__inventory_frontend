import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import React from "react";
import { Link } from "react-router-dom";
import pxToRem from "assets/theme/functions/pxToRem";

function acsessDenied() {
  return (
    <Card sx={{ margin: 3, height: "100vh" }}>
      <MDBox
        mt={5}
        mb={1}
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <MDTypography sx={{ fontSize: pxToRem(48), fontWeight: "700", color: "#475467" }}>
          Access Denied
        </MDTypography>
        <MDTypography sx={{ fontSize: pxToRem(36), fontWeight: "400", color: "#344054" }}>
          You do not have access please contact to admin
        </MDTypography>
        <Link to="/client/setting">
          <MDButton
            variant="contained"
            color="info"
            style={{ textTransform: "none", boxShadow: "none", marginTop: pxToRem(20) }}
          >
            Back
          </MDButton>
        </Link>
      </MDBox>
    </Card>
  );
}

export default acsessDenied;
