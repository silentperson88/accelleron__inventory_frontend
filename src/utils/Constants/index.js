import { CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

//  Messages or Hard Coded Data
const TextMessage = {
  MONGOOSE_ID: "_id",
  NO_DATA_FOUND: "No data found",
  SOMETHING_WENT_WRONG: "Something went wrong",

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
};

// Page titles
export const PageTitles = {
  INVENTORY: "Inventory",
};

// Button titles
export const ButtonTitles = {
  RESET_FILTER: "Reset Filter",
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
};

// Modal Content
export const ModalContent = {};

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
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  IDLE: "idle",
};

export default TextMessage;
