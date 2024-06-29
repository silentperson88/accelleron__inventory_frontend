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
import userRoutes, { authenticationRoute } from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Sessions
import Session from "utils/Sessions";

// JWT decode
import jwtDecode from "jwt-decode";

// Constants
import { defaultData } from "utils/Constants";

export default function App() {
  const [controller] = useMaterialUIController();
  const { layout, sidenavColor, transparentSidenav, whiteSidenav, darkMode } = controller;
  const [role, setRole] = useState("");
  const { pathname } = useLocation();

  // updating role based on token  and Setting page scroll to 0 when changing the route
  useEffect(() => {
    if (pathname.includes("authentication/reset-password")) {
      Session.setClear();
      setRole(defaultData.UNAUTHORIZED_ROLE);
    } else if (Session.userToken) {
      const token = jwtDecode(Session.userToken);
      setRole(token.role);
      Session.setUserRole(token.role);
    } else {
      setRole(defaultData.UNAUTHORIZED_ROLE);
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname, Session.userToken, Session.isSuperAdminViewingAdminPanel]);

  const getRoutes = (allRoutes) =>
    // Filter routes as per the license for all roles except

    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

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
            routes={role === defaultData.USER_ROLE && userRoutes}
            role={role}
          />
          <Configurator />
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(
          (role === defaultData.USER_ROLE && userRoutes) ||
            (role === defaultData.UNAUTHORIZED_ROLE && authenticationRoute)
        )}
        <Route
          path="*"
          element={
            <Navigate
              to={
                (role === defaultData.USER_ROLE && "inventory") ||
                (role === defaultData.UNAUTHORIZED_ROLE && "/authentication/sign-in")
              }
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
