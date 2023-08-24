/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `page` value is used for a page routing. 
  4. The `type` key with the `divider` value is used for a divider between Sidenav items.
  5. The `name` key is used for the name of the route on the Sidenav.
  6. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  7. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  8. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  9. The `route` key is used to store the route location which is used for the react router.
  10. The `href` key is used to store the external links location.
  11. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  12. The `component` key is used to store the component of its route.
*/

// Admin layouts
import QHSEManagement from "layouts/qhseManagement";
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import ResetPassword from "layouts/authentication/reset-password";
import ForgotPassword from "layouts/authentication/forgot-password";
import Profile from "layouts/profile";
import ProjectManagement from "layouts/projectManagement";
import DALShift from "layouts/dalShiftDetails";
import ShiftDetails from "layouts/dalShiftDetails/shiftDetails";
import DPR from "layouts/dpr";
import Report from "layouts/report";
import WFMWizard from "layouts/wfmwizard";
import SetupCardCategory from "layouts/wfmwizard/HealthandSafety/SetupCardCategory";
import QhseConfiguration from "layouts/wfmwizard/HealthandSafety/QhseConfiguration";
import Setuplicenses from "layouts/wfmwizard/Organization/Setuplicenses";
import SetupProject from "layouts/wfmwizard/DailyActivity/SetupProject";
import Usermanagement from "layouts/wfmwizard/System/userManagement";
import Medicalmanagement from "layouts/wfmwizard/System/medicalManagement";
import Rolemanagement from "layouts/wfmwizard/System/RoleManagement";
import RoleAggrement from "layouts/wfmwizard/System/RoleAgreement";
import Feedback from "layouts/feedback/Feedback";
import ReportDetailsComponent from "layouts/report/reportDetails";
import ResourceManagement from "layouts/resourceManagemnet";
import Resources from "layouts/resources";
import EquipmentManagement from "layouts/equipmentManagement";
import EquipmentRequest from "layouts/EquipmentRequest";
import Warehouse from "layouts/warehouse";
import WarehouseListing from "layouts/warehouse/WarehouseListing";
import WarehouseDetails from "layouts/warehouse/WarehouseDetails";
import OrderRequest from "layouts/wfmwizard/Warehouse/OrderRequest";
import OrderDetails from "layouts/wfmwizard/Warehouse/OrderDetails";
import ProductDetails from "layouts/resources/productDetails";
import SetupEquipment from "layouts/wfmwizard/Equipment/SetupEquipment";

// Super Admin Layouts
import Home from "layouts/superadmin/dashboard";
import ClientProfile from "layouts/superadmin/profile";
import LicenseApproval from "layouts/superadmin/LicenseApprovals/LicenseApproval";
import SetupReport from "layouts/wfmwizard/DailyActivity/SetupReport";
import ReportParameterFigure from "layouts/wfmwizard/DailyActivity/ReportParameterFigure";

// @mui icons
import Icon from "@mui/material/Icon";

export const authenticationRoute = [
  {
    type: "page",
    name: "Sign In",
    key: "sign-in",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">SignIn</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "page",
    name: "Forgot Password",
    key: "forgot-password",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">Forgot Password</Icon>,
    route: "/authentication/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "page",
    name: "Reset Password",
    key: "reset-password",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">Reset Password</Icon>,
    route: "/authentication/reset-password/:id/:token",
    component: <ResetPassword />,
  },
];

const adminRoutes = [
  {
    type: "collapse",
    name: "Project Management",
    key: "client/project-management",
    parent: "",
    license: ["Project Management"],
    permissions: [],
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/client/project-management",
    component: <ProjectManagement />,
  },
  {
    type: "collapse",
    name: "Shift Details",
    key: "client/shifts",
    parent: "Project Management",
    license: [],
    permissions: ["Shift Details"],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/shifts",
    component: <DALShift />,
  },
  {
    type: "page",
    name: "Shift Details",
    key: "client/shifts",
    parent: "Project Management",
    license: [],
    permissions: ["Shift Details"],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/shifts/:id",
    component: <ShiftDetails />,
  },
  {
    type: "collapse",
    name: "Report",
    key: "client/report",
    parent: "Project Management",
    license: [],
    permissions: ["Report"],
    icon: <Icon fontSize="small">report</Icon>,
    route: "/client/report",
    component: <Report />,
  },
  {
    type: "page",
    name: "Report",
    key: "client/report",
    parent: "Project Management",
    license: [],
    permissions: ["Report"],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/report/:reportId",
    component: <ReportDetailsComponent />,
  },
  {
    type: "collapse",
    name: "DPR",
    key: "client/dpr",
    parent: "Project Management",
    license: [],
    permissions: ["DPR"],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/dpr",
    component: <DPR />,
  },
  {
    type: "collapse",
    name: "QHSE Management",
    key: "client/qhse-management",
    parent: "",
    license: ["QHSE Management"],
    permissions: [],
    icon: <Icon fontSize="small">ballot</Icon>,
    route: "/client/qhse-management",
    component: <QHSEManagement />,
  },
  {
    type: "collapse",
    name: "QHSE Cards",
    key: "client/qhse-cards",
    parent: "QHSE Management",
    license: [],
    permissions: ["Safe", "Unsafe", "NCR", "Incident"],
    icon: <Icon fontSize="small">style</Icon>,
    route: "/client/qhse-cards",
    component: <Dashboard />,
  },

  {
    type: "collapse",
    name: "Feedback",
    key: "client/feedback",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">feedback</Icon>,
    route: "/client/feedback/:id",
    component: <Feedback />,
  },

  {
    type: "collapse",
    name: "Resource Management",
    key: "client/resource-management",
    parent: "",
    license: [],
    permissions: ["resources"],
    icon: <Icon fontSize="small">engineering</Icon>,
    route: "/client/resource-management",
    component: <ResourceManagement />,
  },
  {
    type: "collapse",
    name: "Resources",
    key: "client/resources",
    parent: "Resource Management",
    license: [],
    permissions: ["resources"],
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/client/resources",
    component: <ResourceManagement />,
  },
  {
    type: "collapse",
    name: "Approvals",
    key: "client/approvals",
    parent: "Resource Management",
    license: [],
    permissions: ["resources"],
    icon: <Icon fontSize="small">approval</Icon>,
    route: "/client/approvals",
    component: <ResourceManagement />,
  },
  {
    type: "collapse",
    name: "Equipment Management",
    key: "client/equipment-management",
    parent: "",
    license: ["Equipment Management"],
    permissions: [],
    icon: <Icon fontSize="small">construction</Icon>,
    route: "/client/equipment-management",
    component: <EquipmentManagement />,
  },
  {
    type: "collapse",
    name: "Inventory",
    key: "client/products",
    parent: "Equipment Management",
    license: [],
    permissions: ["Equipment"],
    icon: <Icon fontSize="small">store</Icon>,
    route: "/client/products",
    component: <ProductDetails />,
  },

  {
    type: "collapse",
    name: "Requests",
    key: "client/requests",
    parent: "Equipment Management",
    license: [],
    permissions: ["Equipment"],
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/client/requests",
    component: <EquipmentRequest />,
  },
  {
    type: "collapse",
    name: "Register",
    key: "client/register",
    parent: "Equipment Management",
    license: [],
    permissions: ["Equipment"],
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/client/register",
    component: <Resources />,
  },
  {
    type: "page",
    name: "Register",
    key: "client/register",
    parent: "Equipment Management",
    license: [],
    permissions: ["Equipment"],
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/client/register/:checkEquipmentId",
    component: <Resources />,
  },
  {
    type: "page",
    name: "Add Warehouse",
    key: "client/add-warehouse",
    parent: "Equipment Management",
    license: [],
    permissions: ["Warehouse"],
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/client/setting/add-warehouse",
    component: <Warehouse />,
  },
  {
    type: "page",
    name: "Warehouse",
    key: "client/warehouse",
    parent: "Equipment Management",
    license: [],
    permissions: ["Warehouse"],
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/client/setting/warehouse",
    component: <WarehouseListing />,
  },
  {
    type: "page",
    name: "Warehouse Details",
    key: "client/warehouse",
    parent: "Equipment Management",
    license: [],
    permissions: ["Warehouse"],
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/client/setting/warehouse/:id",
    component: <WarehouseDetails />,
  },
  {
    type: "page",
    name: "Warehouse Order Request",
    key: "client/warehouse",
    parent: "Equipment Management",
    license: [],
    permissions: ["Warehouse"],
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/client/setting/order-requests",
    component: <OrderRequest />,
  },
  {
    type: "page",
    name: "Order Details",
    key: "client/warehouse",
    parent: "Equipment Management",
    license: [],
    permissions: ["Warehouse"],
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/client/setting/order-requests/:id",
    component: <OrderDetails />,
  },

  {
    type: "page",
    name: "Profile",
    key: "client/profile",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">person</Icon>,
    route: "/client/profile",
    component: <Profile />,
  },
  {
    type: "page",
    name: "Profile",
    key: "client/profile",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">person</Icon>,
    route: "/client/setting/usermanagement/profile/:id",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Settings",
    key: "client/setting",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">settings</Icon>,
    route: "/client/setting",
    component: <WFMWizard />,
  },
  {
    type: "page",
    name: "Category",
    key: "client/setting",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/category",
    component: <SetupCardCategory />,
  },
  {
    type: "page",
    name: "QHSe Configuration",
    key: "client/setting/configuration",
    parent: "",
    license: [],
    permissions: ["Safe", "Unsafe", "NCR", "Incident"],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/configuration",
    component: <QhseConfiguration />,
  },
  {
    type: "page",
    name: "Setup Licenses",
    key: "admin/wizard-licenses",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/wizard-licenses",
    component: <Setuplicenses />,
  },
  {
    type: "page",
    name: "Setup Project",
    key: "admin/wizard-project",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/wizard-project",
    component: <SetupProject />,
  },
  {
    type: "page",
    name: "Setup Report",
    key: "admin/wizard-report",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/report-type",
    component: <SetupReport />,
  },
  {
    type: "page",
    name: "Parameter & Figure",
    key: "admin/wizard-parameter-figure",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/report-type/:reportType/parameter-figure",
    component: <ReportParameterFigure />,
  },
  {
    type: "page",
    name: "User Management",
    key: "admin/usermanagement",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/usermanagement",
    component: <Usermanagement />,
  },
  {
    type: "page",
    name: "Medical Management",
    key: "admin/medicalmanagement",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/medicalmanagement",
    component: <Medicalmanagement />,
  },
  {
    type: "page",
    name: "Role Management",
    key: "admin/role-management",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/role-management",
    component: <Rolemanagement />,
  },
  {
    type: "page",
    name: "Role Aggrement",
    key: "admin/role-management",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/role-management/:id",
    component: <RoleAggrement />,
  },
  {
    type: "page",
    name: "Setup Equipment",
    key: "admin/equipment-setup",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">add card</Icon>,
    route: "/client/setting/equipment-setup",
    component: <SetupEquipment />,
  },
];

export const superAdminRoute = [
  {
    type: "collapse",
    name: "Home",
    key: "admin/home",
    parent: "",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/admin/home",
    component: <Home />,
  },
  {
    type: "page",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person2</Icon>,
    route: "/admin/profile/:id",
    component: <ClientProfile />,
  },
  {
    type: "collapse",
    name: "License Approval",
    key: "admin/licenseapproval",
    parent: "",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/admin/licenseapproval",
    component: <LicenseApproval />,
  },
];

export default adminRoutes;
