import { combineReducers } from "redux";
import userReducer from "./authSlice";
import dashboardReducer from "./dashboardSlice";

export default combineReducers({
  dashboard: dashboardReducer,
  user: userReducer,
});
