/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Upload from "layouts/uploader/components/Upload";

function UploaderInformation() {
  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Upload Excel File
        </MDTypography>
      </MDBox>
      <MDBox pt={2} pb={2} px={2} mx={"auto"}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <Upload />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default UploaderInformation;
