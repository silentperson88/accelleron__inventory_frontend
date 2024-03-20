import InventoryList from "layouts/inventory/inventory";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
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
];

export default routes;
