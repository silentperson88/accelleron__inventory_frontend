import { combineReducers, configureStore } from "@reduxjs/toolkit";
import ConfigReducer from "redux/Slice/Config";
import SafetyCardReducer from "redux/Slice/SafetyCard";
import DynamicFieldReducer from "redux/Slice/DynamicFields";
import NotificationReducer from "redux/Slice/Notification";
import superAdminReducer from "redux/Slice/SuperAdmin";
import AuthenticationReducer from "redux/Slice/Authentication";
import DalShiftReducer from "redux/Slice/DalShift";
import LicenseReducer from "redux/Slice/License";
import ReportSlice from "redux/Slice/Report";
import FeedbackSlice from "redux/Slice/Feedback";
import ProductSlice from "redux/Slice/Equipment";
import WarehouseSlice from "redux/Slice/Warehouse";
import SettingSlice from "redux/Slice/Settings";
import LoanConfigSlice from "redux/Slice/LoanConfig.slice";

export const rootReducer = combineReducers({
  config: ConfigReducer,
  safetCard: SafetyCardReducer,
  dynamicFields: DynamicFieldReducer,
  Notification: NotificationReducer,
  superadmin: superAdminReducer,
  authentication: AuthenticationReducer,
  License: LicenseReducer,
  dalShift: DalShiftReducer,
  report: ReportSlice,
  feedback: FeedbackSlice,
  product: ProductSlice,
  Warehouse: WarehouseSlice,
  setting: SettingSlice,
  loan: LoanConfigSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
