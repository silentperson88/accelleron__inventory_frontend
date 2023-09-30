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

function ProfileForm() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.MOBILE_USERS} />
      </MDBox>
      <MDBox
        mt={5}
        display="flex"
        justifiContent="space-between"
        flexDirection={{ xs: "column", md: "row" }}
        // flexDirection="column"
      >
        <MDBox mb={2} px={2}>
          <MasterCard type="Credit Card Loan" number={4562112245947852} holder="" expires="" />
        </MDBox>
        <MDBox mb={2} px={2}>
          <MasterCard
            type="Personal Loan"
            color="secondary"
            number={4562112245947852}
            holder=""
            expires=""
          />
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default ProfileForm;
