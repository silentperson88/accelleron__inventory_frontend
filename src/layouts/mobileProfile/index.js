import React from "react";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";

// Constant
import { PageTitles } from "utils/Constants";

// Redux component
import MasterCard from "examples/Cards/MasterCard";
import { Grid } from "@mui/material";

function ProfileForm() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.LOAN_DASHBOARD} />
      </MDBox>
      <MDBox px={3} py={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="secondary"
              type={PageTitles.CREDIT_CARD_LOAN}
              number={4562112245947852}
              holder=""
              expires=""
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              type={PageTitles.PERSONAL_LOAN}
              color="primary"
              number={4562112245947852}
              holder=""
              expires=""
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="info"
              type={PageTitles.HOME_LOAN}
              number={4562112245947852}
              holder=""
              expires=""
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="success"
              type={PageTitles.BUSINESS_LOAN}
              number={4562112245947852}
              holder=""
              expires=""
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="warning"
              type={PageTitles.AUTO_LOAN}
              number={4562112245947852}
              holder=""
              expires=""
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="error"
              type={PageTitles.EDUCATION_LOAN}
              number={4562112245947852}
              holder=""
              expires=""
            />
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ProfileForm;
