import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import bgImage from "assets/images/bg-reset-cover.jpeg";

import { Icon, Tooltip } from "@mui/material";

function header({ profileData, handleOpenEdit, children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          py: 8,
          px: 8,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar src={profileData[0]?.companyLogo} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            {profileData?.map((element) => (
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <MDTypography variant="h6" fontWeight="medium">
                  {`${element?.firstName} ${element?.lastName}`}
                </MDTypography>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="caption" fontWeight="medium">
                    {element?.email}
                  </MDTypography>
                  <Tooltip title="Edit Profile" placement="top">
                    <Icon onClick={handleOpenEdit} sx={{ ml: 2, cursor: "pointer" }}>
                      edit
                    </Icon>
                  </Tooltip>
                </MDBox>
              </MDBox>
            ))}
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

export default header;
