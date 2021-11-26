import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import jwt from "jsonwebtoken";

const slice = createSlice({
  name: "user",
  initialState: {
    profile: {},
    redirect: "",
    loading: false,
    error: "",
    status: "pending",
  },
  reducers: {
    changeInput: (user, action) => {
      user[action.payload.name] = action.payload.value;
    },

    userRequested: (user, action) => {
      user.loading = true;
    },
    userReceived: (user, action) => {
      user.profile = action.payload;
      user.loading = false;
    },
    userRequestFailed: (user, action) => {
      user.loading = false;
    },

    signUpStart: (user, action) => {
      user.loading = true;
      user.loggedIn = false;
      user.status = "pending";
    },
    signUpSuccess: (user, action) => {
      user.loading = false;
      user.loggedIn = true;
      user.status = "success";
      localStorage.setItem("authToken", action.payload);
      if (user.redirect) {
        window.location = user.redirect;
      }
    },
    signUpFailed: (user, action) => {
      user.loading = false;
      user.loggedIn = false;
      user.error = action.payload.response.data.message;
      user.status = "failed";
    },
    authStart: (user, action) => {
      user.loading = true;
      user.loggedIn = false;
      user.status = "pending";
    },
    authSuccess: (user, action) => {
      user.loading = false;
      user.loggedIn = true;
      user.profile = action.payload.user;
      user.status = "success";
      localStorage.setItem("authToken", action.payload);
      if (user.redirect) {
        window.location = user.redirect;
      }
    },
    authFailed: (user, action) => {
      user.loading = false;
      user.loggedIn = false;
      // user.error = action.payload;
      user.error = action.payload.response.data.message;
      user.status = "failed";
    },
    authRemoved: (user, action) => {
      user.loggedIn = false;
      localStorage.removeItem("authToken");
      user.profile = {};
    },
  },
});

export const {
  userRequested,
  userReceived,
  userRequestFailed,
  authStart,
  authSuccess,
  authFailed,
  signUpStart,
  signUpSuccess,
  signUpFailed,
  authRemoved,
  changeInput,
} = slice.actions;

export default slice.reducer;

export const changeAuthInput = (name, value) => (dispatch) => {
  dispatch({ type: changeInput.type, payload: { name, value } });
};

export const signUserUp = (data) => (dispatch) => {
  dispatch(
    apiCallBegan({
      url: "/auth/admin",
      method: "post",
      data,
      onStart: signUpStart.type,
      onSuccess: signUpSuccess.type,
      onError: signUpFailed.type,
    })
  );
};

export const logUserIn = (email, password) => (dispatch) => {
  dispatch(
    apiCallBegan({
      url: "auth/login",
      method: "post",
      data: { email, password },
      onStart: authStart.type,
      onSuccess: authSuccess.type,
      onError: authFailed.type,
    })
  );
};

export const logUserOut = () => (dispatch) => {
  window.location = "/";
  return localStorage.removeItem("authToken");
};

export const getLoggedInUser = () => {
  const token = localStorage.getItem("authToken");
  if (token && token !== "undefined") {
    var decoded = jwt.verify(token, "sendme:coded");
    return decoded?.user || null;
  }
  return null;
};
