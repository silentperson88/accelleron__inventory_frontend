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
import burceMars from "assets/images/bg-sign-in-basic.jpeg";
import bgImage from "assets/images/bg-reset-cover.jpeg";
import { CircularProgress, Icon, Tooltip } from "@mui/material";
import Constants from "utils/Constants";

function Header({ children, handleOpenPersonal, adminData }) {
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
      {adminData.length > 0 ? (
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={0}>
              <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" />
            </Grid>
            <Grid item xs={10}>
              {adminData?.map((element) => (
                <MDBox
                  key={element[Constants.MONGOOSE_ID]}
                  height="100%"
                  mt={0.5}
                  lineHeight={1}
                  display="flex"
                  alignItems="center"
                  px={2}
                >
                  <MDTypography variant="h5" fontWeight="medium">
                    {`${element?.firstName} ${element?.lastName}`}
                  </MDTypography>
                  <Tooltip title="Edit Profile" placement="top">
                    <Icon onClick={handleOpenPersonal} sx={{ ml: 2, cursor: "pointer" }}>
                      edit
                    </Icon>
                  </Tooltip>
                </MDBox>
              ))}
            </Grid>
          </Grid>
          {children}
        </Card>
      ) : (
        <MDBox py={5} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress color="info" />
        </MDBox>
      )}
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
  adminData: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleOpenPersonal: PropTypes.func.isRequired,
};

export default Header;
