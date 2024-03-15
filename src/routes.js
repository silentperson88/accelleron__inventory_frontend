// Material Dashboard 2 React layouts
// import Dashboard from "layouts/dashboard";
import Uploader from "layouts/uploader";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  // {
  //   type: "page",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/dashboard",
  //   component: <Dashboard />,
  // },
  {
    type: "page",
    name: "Upload",
    key: "upload",
    icon: <Icon fontSize="small">upload</Icon>,
    route: "/upload",
    component: <Uploader />,
  },
];

export default routes;
