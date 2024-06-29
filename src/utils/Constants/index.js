import { CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

//  Messages or Hard Coded Data
const TextMessage = {
  MONGOOSE_ID: "_id",
  NO_DATA_FOUND: "No data found",
  SOMETHING_WENT_WRONG: "Something went wrong",

  // Authentication
  PASSWORD_FIELD_REQUIRED: "Password field is required",
  PASSWORD_LENGTH_VALIDATION: "Password length should be between 8 and 16",
  PASSWORD_SYMBOL_VALIDATION: "Password should have at least one symbol",
  PASSWORD_DIGIT_VALIDATION: "Password should have at least one digit",
  PASSWORD_LOWERCASE_VALIDATION: "Password should have at least one lowercase letter",
  PASSWORD_UPPERCASE_VALIDATION: "Password should have at least one uppercase letter",
  EMAIL_NOT_VALID: "Email not valid",
  INVALID_SPACE: "Invalid space",
  INVALID_EMAIL: "Invalid Email",
  INVALID_PASSWORD: "Invalid Password",
  USER_LOGOUT_TITTLE: "Logout",
  LOGOUT_MESSAGE: "Are you sure you want to logout?",

  // Redux Constants
  NOTIFICATION_SUCCESS: "success",
  NOTIFICATION_ERROR: "error",
  PENDING: "pending",
  FULFILLED: "fullfilled",
  REJECTED: "rejected",
  IDLE: "idle",
  NO_DATA: "no_data",

  // Upload Excel File
  UPLOAD_SUCCESS_MESSAGE: "File uploaded successfully",
  UPLOAD_ERROR_MESSAGE: "Error uploading file",

  // Status
  IN_USE: "in-use",
  AVAILABLE: "available",
  IN_REPAIR: "in-repair",
  DAMAGED: "damaged",

  // Rack and Pallet Management
  RACK_CREATED_SUCCESSFULLY: "Rack created successfully",
  RACK_UPDATED_SUCCESSFULLY: "Rack updated successfully",
  RACK_DELETED_SUCCESSFULLY: "Rack deleted successfully",
  PALLET_CREATED_SUCCESSFULLY: "Pallet created successfully",
  PALLET_UPDATED_SUCCESSFULLY: "Pallet updated successfully",
  PALLET_DELETED_SUCCESSFULLY: "Pallet deleted successfully",
};

// Page titles
export const PageTitles = {
  INVENTORY: "Inventory",
  RACK_PALLET_MANAGEMENT: "Rack & Pallet Management",
};

// Button titles
export const ButtonTitles = {
  RESET_FILTER: "Reset Filter",
  SUBMIT: "Submit",
  SUBMIT_LOADING: "Submitting...",
  UPLOAD: "Upload",
  UPLOAD_LOADING: "Uploading...",

  // Rack & Pallet Management
  NEW_RACK: "Rack",
  NEW_PALLET: "Pallet",
  NEGATIVE_BUTTON: "No",
  POSITIVE_BUTTON: "Yes",
};

// Card Titles
export const CardTitles = {};

// color constants
export const Colors = {
  PRIMARY: "#1e1faf",
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
  LOADING: <CircularProgress color="info" size={20} />,
  SEACRH: <SearchIcon fontSize="medium" sx={{ cursor: "pointer", color: "#667085" }} />,
  UPLOAD: <FileUploadOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  RESET_FILTER: <RestartAltOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  NEW: <AddOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  RELOAD: <ReplayOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  CROSS: <CloseOutlinedIcon fontSize="medium" sx={{ cursor: "pointer" }} />,
  VIEW: <VisibilityOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: "#475467" }} />,
  EDIT: (
    <ModeEditOutlineOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: "#475467" }} />
  ),
  DELETE: (
    <DeleteOutlineOutlinedIcon fontSize="medium" sx={{ cursor: "pointer", color: "#475467" }} />
  ),
};

// Modal Content
export const ModalContent = {
  NEW_RACK: "New Rack",
  RACK_STATUS: "Rack Status",
  RACK_ACTIVE_STATUS_MESSAGE: "Are you sure you want to activate this rack?",
  ROLE_INACTIVE_STATUS_MESSAGE: "Are you sure you want to deactivate this rack?",
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
  USER_ROLE: "user",
  WEB_ACCESSTYPE: "web",
  BOTH_ACCESSTYPE: "both",
  MOBILE_ACCESSTYPE: "mobile",
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  IDLE: "idle",
};

export default TextMessage;
