import { combineReducers, configureStore } from "@reduxjs/toolkit";
import InventorySlice from "redux/Slice/Inventory.slice";
import Notification from "redux/Slice/Notification.slice";

export const rootReducer = combineReducers({
  inventory: InventorySlice,
  notification: Notification,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
