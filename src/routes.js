import InventoryList from "layouts/inventory/inventory";
import RackAndPAlletManagement from "layouts/rackAndPalletManagement/rackAndPAlletManagement";

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
