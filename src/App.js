import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React routes
import adminRoutes, { superAdminRoute, authenticationRoute } from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Sessions
import Session from "utils/Sessions";

// JWT decode
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";

// Constants
import { defaultData } from "utils/Constants";
import { updateRole } from "redux/Slice/Authentication";

export default function App() {
  const [controller] = useMaterialUIController();
  const { layout, sidenavColor, transparentSidenav, whiteSidenav, darkMode } = controller;
  const [role, setRole] = useState("");
  const { pathname } = useLocation();
  const licensePermissions = useSelector((state) => state.License);
  const [isSuperAdminViewingAdminPanel, setIsSuperAdminViewingAdminPanel] = useState(false);
  const dispatch = useDispatch();

  // updating role based on token  and Setting page scroll to 0 when changing the route
  useEffect(() => {
    if (pathname.includes("authentication/reset-password")) {
      Session.setClear();
      setRole(defaultData.UNAUTHORIZED_ROLE);
    } else if (Session.userToken) {
      const token = jwtDecode(Session.userToken);
      setRole(token.role);
      Session.setUserRole(token.role);
      setIsSuperAdminViewingAdminPanel(Session.isSuperAdminViewingAdminPanel);
      dispatch(updateRole(token.role));
    } else {
      setRole(defaultData.UNAUTHORIZED_ROLE);
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname, Session.userToken, Session.isSuperAdminViewingAdminPanel]);

  const getRoutes = (allRoutes) => {
    // Filter routes as per the license for all roles except superadmin
    let filteredRoutes = [];
    if (
      (role !== defaultData.SUPER_ADMIN_ROLE ||
        (role === defaultData.SUPER_ADMIN_ROLE && isSuperAdminViewingAdminPanel)) &&
      (licensePermissions.permissions.length > 0 ||
        licensePermissions.ownerLicenseLoading === "fullfilled")
    ) {
      filteredRoutes = allRoutes.filter((route) => {
        // add routes whose license are available but extraRoute are not required
        if (route.license.length > 0 && !route.extraRoute) {
          return licensePermissions.permissions.some((permission) =>
            route.license.some(
              (license) => license.toLowerCase() === permission.licence.name.toLowerCase()
            )
          );
        }

        // add routes whose permissions are available
        if (route.license.length === 0 && route.permissions.length > 0) {
          return licensePermissions.permissions.some((permission) =>
            route.permissions.some(
              (permissionName) =>
                permissionName.toLowerCase() === permission.permission.name.toLowerCase()
            )
          );
        }
        // add routes whose license and permissions are not required
        if (route.license.length === 0 && route.permissions.length === 0) {
          return true;
        }
        return false;
      });
    } else {
      filteredRoutes = allRoutes;
    }

    return filteredRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });
  };

  if (role === "") {
    return null;
  }

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && role !== "" && role !== defaultData.UNAUTHORIZED_ROLE && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Reynard"
            routes={
              (role !== defaultData.SUPER_ADMIN_ROLE && adminRoutes) ||
              (role === defaultData.SUPER_ADMIN_ROLE &&
                !isSuperAdminViewingAdminPanel &&
                superAdminRoute) ||
              (role === defaultData.SUPER_ADMIN_ROLE &&
                isSuperAdminViewingAdminPanel &&
                adminRoutes)
            }
            role={role}
          />
          <Configurator />
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(
          (role !== defaultData.SUPER_ADMIN_ROLE &&
            role !== defaultData.UNAUTHORIZED_ROLE &&
            adminRoutes) ||
            (role === defaultData.SUPER_ADMIN_ROLE &&
              !isSuperAdminViewingAdminPanel &&
              superAdminRoute) ||
            (role === defaultData.SUPER_ADMIN_ROLE &&
              isSuperAdminViewingAdminPanel &&
              adminRoutes) ||
            (role === defaultData.UNAUTHORIZED_ROLE && authenticationRoute)
        )}
        <Route
          path="*"
          element={
            <Navigate
              to={
                (role !== defaultData.SUPER_ADMIN_ROLE &&
                  role !== defaultData.UNAUTHORIZED_ROLE &&
                  "client/mobileusers") ||
                (role === defaultData.SUPER_ADMIN_ROLE &&
                  !isSuperAdminViewingAdminPanel &&
                  "admin/home") ||
                (role === defaultData.SUPER_ADMIN_ROLE &&
                  isSuperAdminViewingAdminPanel &&
                  "client/mobileusers") ||
                (role === defaultData.UNAUTHORIZED_ROLE && "/authentication/sign-in")
              }
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
