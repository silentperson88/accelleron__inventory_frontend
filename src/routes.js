// Admin layouts
import SignIn from "layouts/authentication/sign-in";
import CustomerLogin from "layouts/authentication/sign-in/customerLogin";
import ResetPassword from "layouts/authentication/reset-password";
import ForgotPassword from "layouts/authentication/forgot-password";
import ClientHome from "layouts/mobileProfile";
import LoanDashboard from "layouts/loanForm";
import LoanData from "layouts/loanForm/loanData";
import FormScreen from "layouts/loanForm/formScreen";
import Bill from "layouts/billPayments";
import LoanForm from "layouts/mobileProfile/LoanForm";
import MobileUsers from "layouts/mobileUsers";
import LeadUtilsBanks from "layouts/leadUtils/bank/Bank";
import LeadUtilsCodes from "layouts/leadUtils/codes/Code";

// Upcoming Layouts
import MobileRecharge from "layouts/mobileRecharge/mobileRecharge";
import BankAccountOpening from "layouts/bankAccountOpening/bankAccountOpening";
import CibilScore from "layouts/cibilScore/cibilScore";

// Super Admin Layouts
import Home from "layouts/superadmin/dashboard";
import ClientProfile from "layouts/superadmin/profile";
import LicenseApproval from "layouts/superadmin/LicenseApprovals/LicenseApproval";

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
    name: "Sign In",
    key: "sign-in",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">SignIn</Icon>,
    route: "/sign-in",
    component: <CustomerLogin />,
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
    name: "Home",
    key: "client/home",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/client/home",
    component: <ClientHome />,
  },
  {
    type: "collapse",
    name: "Loans & Credit Cards",
    key: "client/loan-form",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">credit_score</Icon>,
    route: "/client/loan-form",
    component: <LoanDashboard />,
  },
  {
    type: "collapse",
    name: "Utility Bill Payments",
    key: "client/bill",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/client/bill",
    component: <Bill />,
  },
  {
    type: "collapse",
    name: "Lead Bay",
    key: "client/lead-bay",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">credit_score</Icon>,
    route: "/client/lead-bay",
    component: <LoanData />,
  },
  {
    type: "page",
    name: "Loan form",
    key: "client/form-screen",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/client/loan/:formIndex",
    component: <FormScreen />,
  },
  {
    type: "page",
    name: "Loan form",
    key: "client/loan-form",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/client/:formType",
    component: <LoanForm />,
  },

  {
    type: "collapse",
    name: "Mobile Users",
    key: "client/mobileusers",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">person</Icon>,
    route: "/client/mobileusers",
    component: <MobileUsers />,
  },
  {
    type: "collapse",
    name: "Lead Utils Banks",
    key: "client/lead-utils-banks",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">person</Icon>,
    route: "/client/lead-utils-banks",
    component: <LeadUtilsBanks />,
  },
  {
    type: "collapse",
    name: "Lead Utils Codes",
    key: "client/lead-utils-codes",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">person</Icon>,
    route: "/client/lead-utils-codes",
    component: <LeadUtilsCodes />,
  },
  {
    type: "collapse",
    name: "Mobile Recharge",
    key: "client/mobile-recharge",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">person</Icon>,
    route: "/client/mobile-recharge",
    component: <MobileRecharge />,
  },
  {
    type: "collapse",
    name: "Bank Account Opening",
    key: "client/bank-account-opening",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">person</Icon>,
    route: "/client/bank-account-opening",
    component: <BankAccountOpening />,
  },
  {
    type: "collapse",
    name: "Cibil Score",
    key: "client/cibil-score",
    parent: "",
    license: [],
    permissions: [],
    icon: <Icon fontSize="small">person</Icon>,
    route: "/client/cibil-score",
    component: <CibilScore />,
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
