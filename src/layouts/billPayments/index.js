import React, { useState } from "react";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import BillForm from "examples/modal/BillForm";

// Constant
import { PageTitles } from "utils/Constants";

// Redux component
import MasterCard from "examples/Cards/MasterCard";
import { Grid } from "@mui/material";

function ProfileForm() {
  const [open, seOpen] = useState(false);
  const [billTitle, setBillTitle] = useState("");

  const handleBillForm = (type) => {
    setBillTitle(type);
    seOpen(true);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {open && <BillForm open={open} handleClose={() => seOpen(false)} title={billTitle} />}
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.LOAN_DASHBOARD} />
      </MDBox>
      <MDBox px={3} py={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="secondary"
              type={PageTitles.ELECTRICITY}
              number={4562112245947852}
              holder=""
              expires=""
              handleAction={handleBillForm}
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              type={PageTitles.WATER}
              color="primary"
              number={4562112245947852}
              holder=""
              expires=""
              handleAction={handleBillForm}
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="info"
              type={PageTitles.GAS}
              number={4562112245947852}
              holder=""
              expires=""
              handleAction={handleBillForm}
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="success"
              type={PageTitles.FASTAG}
              number={4562112245947852}
              holder=""
              expires=""
              handleAction={handleBillForm}
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="warning"
              type={PageTitles.RECHARGE}
              number={4562112245947852}
              holder=""
              expires=""
              handleAction={handleBillForm}
            />
          </Grid>
          <Grid item xs={12} md={6} mb={2} px={2}>
            <MasterCard
              color="error"
              type={PageTitles.MUNCIPAILITY}
              number={4562112245947852}
              holder=""
              expires=""
              handleAction={handleBillForm}
            />
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ProfileForm;
