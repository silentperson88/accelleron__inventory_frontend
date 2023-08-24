// react-router-dom components
import { Link, useLocation, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import jwtDecode from "jwt-decode";
import Sessions from "utils/Sessions";
import { useEffect, useState } from "react";
import { defaultData } from "utils/Constants";

function Breadcrumbs({ icon, light }) {
  const location = useLocation().pathname;
  const [route, setRoute] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (Sessions.userToken) {
      const deocdedToken = jwtDecode(Sessions.userToken);
      setRoute(
        location
          .split(
            (deocdedToken.role === defaultData.SUPER_ADMIN_ROLE &&
              !Sessions.isSuperAdminViewingAdminPanel &&
              "/admin/") ||
              (deocdedToken.role === defaultData.SUPER_ADMIN_ROLE &&
                Sessions.isSuperAdminViewingAdminPanel &&
                "/client/") ||
              (deocdedToken.role !== defaultData.SUPER_ADMIN_ROLE && "/client/")
          )
          .slice(1)
      );
    }
  }, [location]);

  const isValidBreadCumbs = (val) => /^[a-zA-Z-]+$/.test(val) && !/[^a-zA-Z-]/.test(val);

  return (
    <MDBox display="flex" justifyContent="center" mr={{ xs: 0, xl: 8 }}>
      <Link to="/client/qhse-cards">
        <MDTypography
          component="span"
          variant="body2"
          color={light ? "white" : "dark"}
          opacity={light ? 0.8 : 0.5}
          sx={{ lineHeight: 0 }}
        >
          <Icon>{icon}</Icon>
        </MDTypography>
      </Link>
      <MDBox display="flex" flexWrap="wrap" alignItems="center">
        {route[0]?.split("/").map((item, index) => (
          <MDBox key={`${item}${index + 1}`}>
            {isValidBreadCumbs(item) ? (
              <MuiBreadcrumbs
                sx={{
                  "& .MuiBreadcrumbs-separator": {
                    color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
                  },
                }}
              >
                <MDTypography
                  component="span"
                  variant="body2"
                  color={light ? "white" : "dark"}
                  opacity={0}
                  sx={{ lineHeight: 0 }}
                >
                  /
                </MDTypography>
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  textTransform="capitalize"
                  color={light ? "white" : "dark"}
                  onClick={() => {
                    try {
                      const newUrl = `${location.split(item)[0]}${item.toLocaleLowerCase()}`;
                      navigate(newUrl);
                    } catch (error) {
                      // reload the page
                      window.location.reload();
                    }
                  }}
                  sx={{ lineHeight: 0, cursor: "pointer" }}
                >
                  {item}
                </MDTypography>
              </MuiBreadcrumbs>
            ) : null}
          </MDBox>
        ))}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
