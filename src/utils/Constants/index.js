import countries from "countries-list";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PublishIcon from "@mui/icons-material/Publish";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import { CircularProgress } from "@mui/material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CachedIcon from "@mui/icons-material/Cached";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";

//  Messages or Hard Coded Data
const TextMessage = {
  MONGOOSE_ID: "_id",
  ERROR_TEXT: "Error Occured.Try again",
  EMAIL_FIELD_REQUIRED: "Enter the email",
  PASSWORD_FIELD_REQUIRED: "Enter the password",
  EMAIL_NOT_VALID: "Enter Valid Email Address",
  EMAIL_EXIST: "The email already exists. Please provide a different email address.",
  Company_EXIST: "The company already exists. Please choose a different company name.",
  Card_EXIST: "The card already exists. Please select a different card name.",
  VALUE_TOO_SHORT: "Given value is too short",
  VALUE_TOO_LONG: "Given value is too long",
  INVALID_CREDENTIAL: "Invalid credential, please try again.",
  FORGET_PASSWORD_MESSAGE:
    "Confirm your registered email and we will send reset link and the instructions.",
  FORGET_PASSWORD_EMAIL_SUCCESS: "Reset Password link has been sent. Please check your mail.",
  FORGET_PASSWORD_EMAIL_Failure: "User is not registered.",
  PASSWORD_NOT_MATCHED: "Confirm passwords do not match",
  PASSWORD_RESET_SUCCESSFULLY: "Password reset successfully.",
  PASSWORD_LINK_EXPIRED: "Reset password link is expired.",
  INVALID_URL: "Please enter valid URL.",
  INVALID_SPACE: "Empty Space is not allowed",
  PASSWORD_LENGTH_VALIDATION: "Password must be between 8-16 character",
  PASSWORD_UPPERCASE_VALIDATION: "Password must contain at least one uppercase letter",
  PASSWORD_LOWERCASE_VALIDATION: "Password must contain at least one lowercase letter",
  PASSWORD_SYMBOL_VALIDATION: "Password must contain at least one symbol",
  PASSWORD_DIGIT_VALIDATION: "Password must contain at least one digit",
  STATUS_UPDATE_SUCCESS: "Status updated successfully.",
  MEMBER_ADD_SUCCESS: "Member added successfully.",
  MEMBER_UPDATE_SUCCESS: "Member updated successfully.",
  MEMBER_DELETE_SUCCESS: "Member deleted successfully.",
  PHONE_LENGTH_VALIDATION: "Phone number must be of atleast 10 numbers",
  PHONE_VALIDATION: "Invalid phone number",
  SHIFT_CREATE_SUCCESS: "Shift created successfully.",
  SHIFT_UPDATE_SUCCESS: "Shift updated successfully.",
  SHIFT_DELETE_SUCCESS: "Shift deleted successfully.",
  INVALID_SHIFT: "Shift does not exist.",
  CATEGORY_CREATE_SUCCESSFULLY: "Category created succesfully.",
  CATEGORY_UPDATE_SUCCESSFULLY: "Category updated succesfully.",
  CATEGORY_DELETE_SUCCESSFULLY: "Category deleted succesfully.",
  PROFILE_UPDATED_SUCCESS: "Profile updated Successfully",
  ACTIVITY_ADD_SUCCESS: "Activity Added Successfully.",
  ACTIVITY_UPDATE_SUCCESS: "Activity Updated Successfully.",
  ACTIVITY_DELETE_SUCCESS: "Activity Deleted Successfully.",
  NO_DATA_FOUND: "No data found.",
  SOMETHING_WENT_WRONG: "Something went wrong.",
  REQUIRED: "Required.",
  INVALID_VALUEL: "Value cannot start with a number.",
  INVALID_RANGE: "Enter valid range.",
  ACTIVITY_WARNING: "Please create a Scope before creating an Activity.",
  PROJECT_STRING_WARNING: "Please create a Location before creating a Project string.",
  ASSET_WARNING: "Please create a Project string and location before creating an Asset.",
  MEMBER_WARNING: "Please create a functions before creating a Member.",
  SLIDER_RANGE_VALUE_VALIDATION: "Please add max greater than min",
  SLIDER_NEGATIVE_VALUE_VALIDATION: "Value cannot be less than 0.",
  INVALID_VALUE: "Invalid value",
  REPORT_TYPE_CREATE_SUCCESS: "Report Type created successfully.",
  REPORT_TYPE_CREATE_ERROR: "Report Type already exist.",
  REPORT_TYPE_UPDATE_SUCCESS: "Report Type updated successfully.",
  REPORT_TYPE_UPDATE_ERROR: "Report Type already exist.",
  REPORT_TYPE_DELETE_SUCCESS: "Report Type deleted successfully.",
  REPORT_TYPE_DELETE_ERROR: "Report Type cannot be deleted.",
  PARAMETER_CREATE_SUCCESS: "Parameter created successfully.",
  PARAMETER_UPDATE_SUCCESS: "Parameter updated successfully.",
  PARAMETER_DELETE_SUCCESS: "Parameter deleted successfully.",
  PARAMETER_DELETE_ERROR: "Parameter cannot be deleted.",
  PARAMETER_ALREADY_EXIST: "Parameter already exist.",
  PARAMETER_NOT_EXIST: "Parameter does not exist.",
  PUBLISH_SUCCESS: "Report published successfully.",
  TOTAL_WEIGHTAGE_NOT_100: "Total weightage should be 100 to publish report.",
  NOTIFICATION_SUCCESS: "success",
  NOTIFICATION_ERROR: "error",
  USER_STATUS_UPDATE_SUCCESS: "User status update successfully",
  REPORT_DELETE_SUCCESS: "Report deleted successfully.",
  REPORT_DELETE_ERROR: "Report cannot be deleted.",
  REPORT_ALREADY_EXIST: "Report already exist.",
  REPORT_STATUS: "Report status",
  REPORT_STATUS_SUCCESS: "Report Status Updated Successfully",
  REPORT_STATUS_ERROR: "Report Status Updated Failed",
  CERTIFICATE_UPDATE: "Certificate status updated successfully",
  LICENSE_PROVISION_SUCCESS: "License provisioned successfully",
  LICENSE_REMOVED_SUCCESS: "License removed successfully",
  PROFILE_IMAGE_UPDATE: "Profile image updated successfully",
  FEEDBACK_DELETE_SUCCESS: "Feedback deleted successfully",
  FEEDBACK_DELETE_ERROR: "Feedback cannot be deleted",
  SYNC_UP_TIME_SUCCESS: "Sync up time updated successfully",
  SYNC_UP_TIME_ERROR: "Sync up time cannot be updated",
  SAFETY_CARD_CREATE_SUCCESS: "Safety card created successfully",
  SAFETY_CARD_UPDATE_SUCCESS: "Safety card updated successfully",
  SAFETY_CARD_DELETE_SUCCESS: "Safety card deleted successfully",
  SAFETY_CARD_DELETE_ERROR: "Safety card cannot be deleted",
  MEDICAL_QUESTIONS_CREATE_SUCCESS: "Medical Question created successfully.",
  MEDICAL_QUESTIONS_CREATE_ERROR: "Medical Question already exist.",
  MEDICAL_QUESTIONS_UPDATE_SUCCESS: "Medical Question updated successfully.",
  MEDICAL_QUESTIONS_UPDATE_ERROR: "Medical Question already exist.",
  MEDICAL_QUESTIONS_DELETE_SUCCESS: "Medical Question deleted successfully.",
  MEDICAL_QUESTIONS_DELETE_ERROR: "Medical Question cannot be deleted.",
  MEDICAL_QUESTIONS_CONFIRMATION_SUCCESS: "Medical Question published successfully.",
  ROLE_CREATED_SUCCESSFULLY: "Role created successfully",
  ROLE_UPDATED_SUCCESSFULLY: "Role updated successfully",
  ROLE_DEACTIVATED_SUCCESSFULLY: "Role deactivated successfully",
  ROLE_ASSIGNED_SUCCESSFULLY: "Role assigned successfully",
  USER_LOGOUT_TITTLE: "Logout",
  SWITCH_ACCOUNT_TITTLE: "Switch Account",
  LOGOUT_MESSAGE: "Are you sure you want to logout?",
  SWITCH_SUPERADMIN_ACCOUNT_TO_ADMIN_MESSAGE:
    "Are you sure you want to switch to super admin account?",

  // Warehouse
  WAREHOUSE_CREATE_SUCCESS: "Warehouse created successfully.",
  WAREHOUSE_UPDATE_SUCCESS: "Warehouse updated successfully.",
  WAREHOUSE_DELETE_SUCCESS: "Warehouse deleted successfully.",
  WAREHOUSE_DELETE_ERROR: "Warehouse cannot be deleted.",
  WAREHOUSE_ALREADY_EXIST: "Warehouse already exist.",
  WAREHOUSE_NOT_EXIST: "Warehouse does not exist.",
  FILE_TYPE_NOT_ALLOWED: "File type not allowed.",

  // Setup Equipment
  EQUIPMENT_TYPE_CREATE_SUCCESS: "Equipment type created successfully.",
  EQUIPMENT_TYPE_UPDATE_SUCCESS: "Equipment type updated successfully.",
  EQUIPMENT_TYPE_DELETE_SUCCESS: "Equipment type deleted successfully.",

  EQUIPMENT_CATEGORY_CREATE_SUCCESS: "Equipment category created successfully.",
  EQUIPMENT_CATEGORY_UPDATE_SUCCESS: "Equipment category updated successfully.",
  EQUIPMENT_CATEGORY_DELETE_SUCCESS: "Equipment category deleted successfully.",

  CURRENCY_UNIT_CREATE_SUCCESS: "Currency unit created successfully.",
  CURRENCY_UNIT_UPDATE_SUCCESS: "Currency unit updated successfully.",
  CURRENCY_UNIT_DELETE_SUCCESS: "Currency unit deleted successfully.",

  WEIGHT_FORM_CREATE_SUCCESS: "Weight form created successfully.",
  WEIGHT_FORM_UPDATE_SUCCESS: "Weight form updated successfully.",
  WEIGHT_FORM_DELETE_SUCCESS: "Weight form deleted successfully.",

  QUANTITY_TYPE_CREATE_SUCCESS: "Quantity type created successfully.",
  QUANTITY_TYPE_UPDATE_SUCCESS: "Quantity type updated successfully.",
  QUANTITY_TYPE_DELETE_SUCCESS: "Quantity type deleted successfully.",

  CERTIFICATE_TYPE_CREATE_SUCCESS: "Certificate type created successfully.",
  CERTIFICATE_TYPE_UPDATE_SUCCESS: "Certificate type updated successfully.",
  CERTIFICATE_TYPE_DELETE_SUCCESS: "Certificate type deleted successfully.",

  HSCODE_CREATE_SUCCESS: "HS Code created successfully.",
  HSCODE_UPDATE_SUCCESS: "HS Code updated successfully.",
  HSCODE_DELETE_SUCCESS: "HS Code deleted successfully.",

  // Equipment
  EQUIPMENT_CREATE_SUCCESS: "Equipment created successfully.",
  EQUIPMENT_UPDATE_SUCCESS: "Equipment updated successfully.",
  EQUIPMENT_DELETE_SUCCESS: "Equipment deleted successfully.",
  EQUIPMENT_DELETE_ERROR: "Equipment cannot be deleted.",
};

// Page titles
export const PageTitles = {
  SAFETY_CARD: "QHSE Cards",
  DAL_SHIFT: "Shifts",
  SHIFT_DETAILS: "Shift Details",
  REPORT: "Report",
  DPR: "DPR",
  CONFIGURE_SAFE_CARD: "Configure Safe Card",
  CONFIGURE_UNSAFE_CARD: "Configure Unsafe Card",
  CONFIGURE_NCR_CARD: "Configure NCR Card",
  CONFIGURE_INCIDENT_CARD: "Configure Incident Card",
  WFM_WIZARD: "WFM Wizard",
  SETUP_LICENCE: "Setup Licence",
  USER_MANAGEMENT: "User Management",
  SETUP_PROJECT: "Setup Project",
  SETUP_CATEGORY: "Setup Category",
  SETUP_REPORT: "Setup Report",
  REPORT_TYPE: "Report Type",
  REPORT_PARAMETER_FIGURE: "Parameter & Figure",
  CONFIGURATION: "Configuration",
  FEEDBACK: "Feedback",
  SETTINGS: "Settings",
  ROLE_MANAGEMENT: "Role Management",
  ROLE_AGGREMENT: "Role Agreement",
  EQUIPMENT: "Equipment",
  REGISTER_EQUIPMENT: "Register Equipment",
  EQUIPMENT_REQUESTS: "Equipment Requests",
  UPDATE_EQUIPMENT: "Update Equipment",
  EQUIPMENT_SETUP: "Equipment Setup",
  ADD_NEW_WAREHOUSE: "Add New Warehouse",
  EDIT_WAREHOUSE: "Edit Warehouse",
  WAREHOUSE: "Warehouse",
  ORDER_REQUEStS: "Order Requests",
  ORDER_DETAIL: "Order #",
  WAREHOUSE_DETAILS: "Warehouse Details",
};

// Button titles
export const ButtonTitles = {
  LOGIN_BUTTON: "Login",
  FORGET_PASSWORD_BUTTON: "Forgot Password",
  BACK_TO_LOGIN_BUTTON: "Back to Login",
  RESET_PASSWORD_BUTTON: "Reset Password",
  NEW_SAFE: "Safe Card",
  NEW_UNSAFE: "Unsafe Card",
  NEW_NCR: "NCR Card",
  NEW_INCIDENT: "Incident Card",
  NEW_SHIFT: "Shift Card",
  SHIFT_STATUS: "Shift Status",
  NEW_MEMBER: "Member",
  NEW_ACTIVITY: "Activity",
  NEW_CATEGORY: "Category",
  NEW_REPORT: "Report",
  NEW_DPR: "DPR",
  NEW_PROJECT: "Project",
  NEW_LOCATION: "Location",
  NEW_PROJECT_STRING: "Project String",
  NEW_ASSET: "Asset",
  NEW_FUNCTION: "Function",
  NEW_REPORT_TYPE: "Report Type",
  NEW_REPORT_PARAMETER_FIGURE: "Parameter & Figure",
  RESET_FILTER: "Reset Filter",
  EXPORT: "Export",
  LOADING: "Loading...",
  SUBMIT: "Submit",
  SUBMIT_LOADING: "Submitting...",
  UPDATE: "Update",
  UPDATE_LOADING: "Updating...",
  CREATE_DROPDOWN: "Create Dropdown Field",
  CREATE_CHECKBOX: "Create Checkbox Field",
  CREATE_SHORTANSWER: "Create Short Field",
  CREATE_DATE: "Create Date Field",
  CREATE_DATETIME: "Create Datetime Field",
  CREATE_NUMBER: "Create Number Field",
  CREATE_SLIDER: "Create Slider Field",
  CREATE_BOOLEAN: "Create Boolean Field",
  APPROVE_LICENSE: "Approve",
  REJECT_LICENSE: "Reject",
  NEW_FIELD: "Add a Field",
  STATUS: "Status",
  PUBLISH: "Publish",
  PUBLISH_LOADING: "Publishing...",
  CREATE_FIELD: "Create Field",
  CREATE_FIELD_LOADING: "Creating Field...",
  UPDATE_FIELD: "Update Field",
  UPDATE_FIELD_LOADING: "Updating Field...",
  ADD_OPTIONS: "Add Options",
  APPROVE_CERTIFICATE: "Approve",
  REJECT_CERTIFICATE: "Reject",
  NEW_ROLE: "Role",
  NEGATIVE_BUTTON: "No",
  POSITIVE_BUTTON: "Yes",
  POSITIVE_LOADING_BUTTON: "Loading...",
  SWITCH_TO_SUPERADMIN: "Switch to Super Admin",
  NEW_WAREHOUSE: "Warehouse",
  UPDATE_AND_CONTINUE: "Update and Continue",
  SAVE_AND_CONTINUE: "Save and Continue",
  ADD_PRODUCT: "Add Product",
  EDIT_DETAILS: "Edit Details",
  SAVE: "Save",
  CANCEL: "Cancel",
  BACK: "Back",
  DOWNLOAD_IMPORT_SAMPLE: "Download Import Sample",
  NEW_REQUEST: "Request",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PLACE_ORDER: "Place Order",
};

// License and Permission
export const LicensePermission = {
  // License
  QHSE_MANAGEMENT: "QHSE Management",
  PROJECT_MANAGEMENT: "Project Management",
  WFM_WIZARD: "WFM Wizard",
  // Permissions
  SAFE_CARD: "Safe",
  UNSAFE_CARD: "Unsafe",
  NCR_CARD: "NCR",
  INCIDENT_CARD: "Incident",
  DAL_SHIFT_DETAILS: "DAL Shift Details",
  REPORT: "Report",
  DPR: "DPR",
  EQUIPMENT: "Equipment",
  WAREHOUSE: "Warehouse",
};

// Card Titles
export const CardTitles = {
  LOGIN: "Login",
  FORGET_PASSWORD: "Forgot Password",
  SHIFT: "Shift",
  SHIFT_STATUS: "Shift Status",
  SHIFT_OVERVIEW: "Shift Overview",
  TEAM_MEMBERS: "Team Members",
  ACTIVITY: "Activity",
  ORGANIZATION: "Organization",
  SYSTEM_MANAGEMENT: "User Management",
  PROJECT_MANAGEMENT: "Project Management",
  HEALTH_SAFETY: "Quality, Health & Safety",
  ACTIONS: "Actions",
  EQUIPMENT: "Equipment",
  PERSONAL_SETTING: "Personal Setting",
  ADD_REPORT: "Add Report",
  REPORT_DETAILS: "Report Details",
};

// color constants
export const Colors = {
  PRIMARY: "#191A51",
  PRIMARY1: "191A51",
  SECONDARY: "#FFC107",
  ERROR: "#9D0202",
  SUCCESS: "#029E3B",
  INFO: "#2196F3",
  WARNING: "#FF9800",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  GREY: "#9E9E9E",
  STATUS_Background: "#F5F5F5",
  STATUS_COLOR: "#FFC107",
  LIGHT_YELLOW: "#f7f2e5",
  DARK_YELLOW: "#B68300",
  LIGHT_ORANGE: "#ffefe5",
  DARK_ORANGE: "#ff6600",
  LIGHT_RED: "#9d02021a",
  DARK_RED: "#9D0202",
  LIGHT_GREEN: "#2a8c001a",
  DARK_GREEN: "#2A8C00",
  LIGHT_GRAY: "#E8E8EE",
  LIGHT_GRAY2: "#D9D9D9",
};

// icon constants
export const Icons = {
  NEW: <AddCircleOutlineOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  ADD: <AddIcon fontSize="large" sx={{ cursor: "pointer", color: "#667085" }} />,
  ADD2: <AddIcon fontSize="medium" sx={{ cursor: "pointer", color: "#475467" }} />,
  EDIT: <EditOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: "#475467" }} />,
  EDIT2: <EditOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  DELETE: (
    <DeleteOutlineOutlinedIcon
      color="error"
      fontSize="medium"
      sx={{ cursor: "pointer", color: "#475467" }}
    />
  ),
  DELETE2: (
    <DeleteOutlineOutlinedIcon
      fontSize="medium"
      sx={{ cursor: "pointer", zIndex: 9999, color: "red" }}
    />
  ),
  VIEW: (
    <VisibilityOutlinedIcon
      color="info"
      fontSize="medium"
      sx={{ cursor: "pointer", color: "#475467" }}
    />
  ),
  VIEW2: (
    <VisibilityOutlinedIcon
      color="info"
      fontSize="medium"
      sx={{ cursor: "pointer", color: "#ffffff" }}
    />
  ),
  RESET_FILTER: <RestartAltOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  EXPORT: <FileUploadOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  CLOSE: <CloseOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  DROPDOWN: () => <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#475467" }} />,
  PUBLISH: <PublishIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  DOWNLOAD: <FileDownloadOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  ACCEPT: <CheckIcon sx={{ cursor: "pointer" }} />,
  ACCEPT2: <CheckCircleOutlineIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  REJECT: <ClearIcon fontSize="large" sx={{ cursor: "pointer", color: "#ffffff" }} />,
  WARNING: (
    <WarningAmberOutlinedIcon fontSize="small" sx={{ cursor: "pointer", color: "#EB8D00" }} />
  ),
  CROSS: <CancelOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: "#ffffff" }} />,
  CROSS2: <CancelOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: "#FF2E2E" }} />,
  CROSS3: <CloseIcon sx={{ color: "#9D0202" }} />,
  SEACRH: <SearchIcon fontSize="medium" sx={{ cursor: "pointer", color: "#667085" }} />,
  LOADING: <CircularProgress color="info" size={20} />,
  LOADING2: <CircularProgress color="info" />,
  NEXT: (
    <ArrowCircleRightOutlinedIcon fontSize="large" sx={{ cursor: "pointer", color: "#ffffff" }} />
  ),
  PREVIOUS: (
    <ArrowCircleLeftOutlinedIcon fontSize="large" sx={{ cursor: "pointer", color: "#ffffff" }} />
  ),
  DASH: <RemoveIcon sx={{ cursor: "pointer", color: "#ff6600" }} />,
  ADMIN: (
    <AdminPanelSettingsOutlinedIcon
      fontSize="medium"
      sx={{ cursor: "pointer", color: "#475467" }}
    />
  ),
  DOWNLOAD2: <DownloadIcon fontSize="medium" sx={{ cursor: "pointer", color: "#ffffff" }} />,
  PRINT: <PrintIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  QR: <QrCode2Icon fontSize="medium" sx={{ cursor: "pointer", color: "#667085" }} />,
  RELOAD: <CachedIcon fontSize="large" sx={{ cursor: "pointer", color: "#000000" }} />,
  MANAGE_ACCOUNT: (
    <ManageAccountsOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: "#475467" }} />
  ),
  IMAGE: <ImageOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: "#667085" }} />,
  ARROW_DOWN: <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#B68300" }} />,
  REJECTED: (
    <CancelOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: Colors.DARK_RED }} />
  ),
  APPROVED: (
    <CheckCircleOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: Colors.SUCCESS }} />
  ),
  CHEKOUT: <ShoppingCartCheckoutIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  ATTACHMENT: <AttachFileIcon fontSize="small" sx={{ cursor: "pointer" }} />,
};

// custom jsx components
export const CustomComponents = {
  DROPDOWN_ICON: () => <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#475467" }} />,
};

// Modal Content
export const ModalContent = {
  NEW_REPORT_TYPE_TITLE: "Report Type",
  EDIT_REPORT_TYPE_TITLE: "Edit Report Type",
  REPORT_TYPE_DELETE_TITLE: "Delete Report Type",
  REPORT_TYPE_DELETE_MESSAGE: "Are you sure you want to delete this report type?",
  REPORT_PARAMETER_FIGURE_TITLE: "Parameter & Figure",
  REPORT_PARAMETER_FIGURE_DELETE_TITLE: "Delete Parameter & Figure",
  REPORT_PARAMETER_FIGURE_DELETE_MESSAGE:
    "Are you sure you want to delete this parameter & figure?",
  DELETE_MEMBER: "Are you sure you want to delete this member?",
  DELETE_SHIFT: "Are you sure you want to delete this shift?",
  DELETE_ACTIVITY: "Are you sure you want to delete this activity?",
  DELETE_CATEGORY: "Are you sure you want to delete this category?",
  REPORT_DELETE_TITLE: "Delete Report",
  REPORT_DELETE_MESSAGE: "Are you sure you want to delete this report?",
  ADD_SHIFT_ACTIVITY: "Shift Activity",
  EDIT_SHIFT_ACTIVITY: "Edit Shift Activity",
  FEEDBACK_DELETE_TITLE: "Delete Feedback",
  FEEDBACK_DELETE_MESSAGE: "Are you sure you want to delete this feedback?",
  QHSE_CARD: "QHSE Card",
  QHSE_UPDATE_CARD: "Update QHSE Card",
  NEW_MEDICAL_QUESTION_TYPE_TITLE: "Add New Medical Question",
  UPDATE_MEDICAL_QUESTION_TITLE: "Update Medical Question",
  MEDICAL_QUESTION_DELETE_TITLE: "Delete Medical Question",
  MEDICAL_QUESTION_DELETE_MESSAGE: "Are you sure you want to delete this medical question?",
  MEDICAL_QUESTION_CONFIRMATION_TITLE: "Publish Medical Question",
  MEDICAL_QUESTION_CONFIRMATION_MESSAGE: "Are you sure you want to publish this question",
  NEW_ROLE: "Role",
  EDIT_ROLE: "Edit Role",
  ROLE_STATUS: "Role status",
  ROLE_ACTIVE_STATUS_MESSAGE: "Are you sure you want to activate this role?",
  ROLE_INACTIVE_STATUS_MESSAGE: "Are you sure you want to deactivate this role?",
  CARD_CATEGORY_DELETE_TITLE: "Delete Card",
  CARD_CATEGORY_DELETE_MESSAGE: "Are you sure you want to delete this card?",
  SHIFT_DELETE_TITLE: "Delete Shift",
  SHIFT_DETAILS_MEMBER_DELETE_TITLE: "Delete Member from the shift",
  ASSIGN_ROLE_TITLE: "Assign Role",
  ASSIGN_ROLE_MESSAGE: "Are you sure you want to assign this roles?",
  UPDATE_ADMIN: "Update Admin Profile",
  DELETE_WAREHOUSE_TITLE: "Delete Warehouse",
  DELETE_WAREHOUSE_MESSAGE: "Are you sure you want to delete this warehouse?",
  DELETE_EQUIPMENT_TITLE: "Delete Equipment",
  DELETE_EQUIPMENT_MESSAGE: "Are you sure you want to delete this equipment?",
};

// Form Fields types
export const FormFields = {
  DROPDOWN_LABEL: "Dropdown",
  DROPDOWN_VALUE: "options",
  SHORT_ANSWER_LABEL: "Short Answer",
  SHORT_ANSWER_VALUE: "text",
  CHECKBOX_LABEL: "Checkbox",
  CHECKBOX_VALUE: "checkbox",
  DATE_LABEL: "Date",
  DATE_VALUE: "date",
  DATE_TIME_LABEL: "Date & Time",
  DATE_TIME_VALUE: "datetime",
  NUMBER_LABEL: "Number",
  NUMBER_VALUE: "number",
  SLIDER_LABEL: "Slider",
  SLIDER_VALUE: "slider",
  BOOLEAN_LABEL: "Boolean",
  BOOLEAN_VALUE: "boolean",
  IMAGE_LABEL: "Image",
  IMAGE_VALUE: "image",
  SIGNATURE_LABEL: "Signature",
  SIGNATURE_VALUE: "signature",
  NOT_APPLICABLE: "N/A",
};

//  feature tags
export const FeatureTags = {
  SHIFT_DETAILS: "shiftDetails",
  SETUP_REPORT: "setupReport",
  ROLE_MANAGEMENT: "roleManagement",
  SETUP_EQUIPMENT: "setupEquipment",
  WAREHOUSE: "warehouse",
};

export const defaultData = {
  DEFAULT_DATA_IDENTIFIER: "default",
  NORMAL_DATA_IDENTIFIER: "normal",
  DATE_ON_SINGLE_API_CALL: 50,
  PER_PAGE: 25,
  PER_PAGE_2: 10,
  PAGE: 0,
  WEB_DATE_FORMAT: "DD-MM-YYYY",
  DATABSE_DATE_FORMAT: "YYYY-MM-DD",
  WEB_12_FORMAT: "DD-MM-YYYY HH:mm A",
  WEB_24_HOURS_FORMAT: "DD-MM-YYYY HH:mm:ss",
  DATABASE_24_HOURS_FORMAT: "YYYY-MM-DDTHH:mm:ss",
  REACTDATETIMEPICKER_DATE_FORMAT: "dd-MM-yyyy",
  REACTDATETIMEPICKER_12_HOURS_FORMAT: "dd-MM-yyyy HH:mm aa",
  REACTDATETIMEPICKER_24_HOURS_FORMAT: "dd-MM-yyyy HH:mm:ss",
  UNAUTHORIZED_ROLE: "unauthorized",
  ADMIN_ROLE: "admin",
  SUPER_ADMIN_ROLE: "superadmin",
  WEB_ACCESSTYPE: "web",
  BOTH_ACCESSTYPE: "both",
  MOBILE_ACCESSTYPE: "mobile",
  PENDING_STATUS: "pending",
  FULFILLED_STATUS: "fulfilled",
  REJECTED_STATUS: "rejected",

  // Config Screens Id
  SAFE_CARD_SCREEN_ID: "safe_01",
  UNSAFE_CARD_SCREEN_ID: "unsafe_02",
  NCR_CARD_SCREEN_ID: "ncr_03",
  INCIDENT_CARD_SCREEN_ID: "incident_04",
  FEEDBACK_SCREEN_ID: "submit_feedback_05",
  SHIFT_SCREEN_ID: "open_shift_06",
  REPORT_SCREEN_ID: "report_07",
  SHIFT_ACTIVITY_SCREEN_ID: "shift_activity_08",
  EQUIPMENT_SCREEN_ID: "equipment_10",
  WAREHOUSE_SCREEN_ID: "warehouse_11",
};

export const countryList = Object.values(countries.countries).map((country) => country.name);

export default TextMessage;
