import { Card, Divider } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import React from "react";
import bgImage from "assets/images/coming_soon.png";
import { PageTitles } from "utils/Constants";

function index() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PageTitle title={PageTitles.MOBILE_RECHARGE} />
      <Divider sx={{ marginTop: 2 }} />
      <Card sx={{ marginTop: 3, height: "80vh" }}>
        <MDBox
          mt={5}
          mb={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100vh" }}
        >
          <img
            src={bgImage}
            alt="Preview"
            style={{
              height: "490px",
              width: "420px",
              opacity: "20%",
            }}
          />
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default index;
