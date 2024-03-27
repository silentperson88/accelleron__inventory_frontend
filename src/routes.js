import InventoryList from "layouts/inventory/inventory";
import RackAndPAlletManagement from "layouts/rackAndPalletManagement/rackAndPAlletManagement";
import SignIn from "layouts/authentication/sign-in";
import ResetPassword from "layouts/authentication/reset-password";
import ForgotPassword from "layouts/authentication/forgot-password";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "page",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">SignIn</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "page",
    name: "Forgot Password",
    key: "forgot-password",
    icon: <Icon fontSize="small">Forgot Password</Icon>,
    route: "/authentication/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "page",
    name: "Reset Password",
    key: "reset-password",
    icon: <Icon fontSize="small">Reset Password</Icon>,
    route: "/authentication/reset-password/:id/:token",
    component: <ResetPassword />,
  },
  {
    type: "collapse",
    name: "Inventory",
    key: "inventory",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">store</Icon>,
    route: "/inventory",
    component: <InventoryList />,
  },
  {
    type: "collapse",
    name: "Racks",
    key: "racks",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">store</Icon>,
    route: "/racks",
    component: <RackAndPAlletManagement />,
  },
];

export default routes;
