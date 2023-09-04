import { useEffect } from "react";

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React context
import { useMaterialUIController, setLayout } from "context";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MDTypography from "components/MDTypography";
import { closeSnackBar } from "redux/Slice/Notification";

function DashboardLayout({ xPadding, children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const Notification = useSelector((state) => state.Notification);
  const dispatchAction = useDispatch();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  const handleSnackbarClose = () => {
    dispatchAction(closeSnackBar());
  };

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        px: pxToRem(xPadding),
        position: "relative",
        background: "linear-gradient(0deg, #f6f7ff, #f6f7ff)",
        minHeight: "100vh",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(65) : pxToRem(250),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={Notification.openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={Notification.notificationType}
          sx={{
            width: "100%",
            backgroundColor: Notification.notificationType === "success" ? "green" : "error",
          }}
        >
          <MDTypography
            variant="body"
            color={Notification.notificationType === "success" ? "light" : "error"}
          >
            {Notification.snackbarMessage}
          </MDTypography>
        </Alert>
      </Snackbar>
    </MDBox>
  );
}

DashboardLayout.defaultProps = {
  xPadding: 30,
};

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  xPadding: PropTypes.number,
};

export default DashboardLayout;
