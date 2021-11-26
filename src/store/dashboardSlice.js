import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "dashboard",
  initialState: {
    stocks: [],
    stockAdding: false,
    stockUpdating: false,
    stockDeleting: false,
    addUserStatus: "pending",
    userAdding: false,
    newUserDetails: null,
    stockDeleteStatus: "pending",
    stocksLoading: false,
    stocksLoadingStatus: "pending",
    stockUpdateStatus: "pending",
    addStockStatus: "pending",
    transactions: [],
    transactionsLoading: false,
    transactionsLoadingStatus: "pending",
    users: [],
    usersLoading: false,
    usersLoadingStatus: "pending",
  },
  reducers: {
    changeValue: (dashboard, action) => {
      dashboard[action.payload.key] = action.payload.value;
    },
    userAddStarted: (dashboard, action) => {
      dashboard.addUserStatus = "pending";
      dashboard.userAdding = true;
    },
    userAdded: (dashboard, action) => {
      dashboard.users = [...dashboard.users, action.payload];
      dashboard.addUserStatus = "success";
      dashboard.userAdding = false;
      dashboard.newUserDetails = action.payload;
    },
    userAddFailed: (dashboard, action) => {
      dashboard.addUserStatus = "failed";
      dashboard.userAdding = false;
    },
    stockAddStarted: (dashboard, action) => {
      dashboard.addStockStatus = "pending";
      dashboard.stockAdding = true;
    },
    stockAdded: (dashboard, action) => {
      dashboard.stocks = [...dashboard.stocks, action.payload];
      dashboard.addStockStatus = "success";
      dashboard.stockAdding = false;
    },
    stockAddFailed: (dashboard, action) => {
      dashboard.addStockStatus = "failed";
      dashboard.stockAdding = false;
    },
    stocksRequested: (dashboard, action) => {
      dashboard.stocksLoadingStatus = "pending";
      dashboard.stocksLoading = true;
    },
    stocksReceived: (dashboard, action) => {
      dashboard.stocks = action.payload;
      dashboard.stocksLoadingStatus = "success";
      dashboard.stocksLoading = false;
    },
    stocksRequestFailed: (dashboard, action) => {
      dashboard.stocksLoadingStatus = "failed";
      dashboard.stocksLoading = false;
    },
    stockUpdateStarted: (dashboard, action) => {
      dashboard.stockUpdateStatus = "pending";
      dashboard.stockUpdating = true;
    },
    stockUpdated: (dashboard, action) => {
      dashboard.stockUpdateStatus = "success";
      dashboard.stockUpdating = false;
      const currentStock = dashboard.stocks;
      const stockIndex = currentStock.findIndex(
        (i) => i._id === action.payload._id
      );
      if (stockIndex !== -1) {
        currentStock.splice(stockIndex, 1, action.payload);
      }
      dashboard.stocks = [...currentStock];
    },

    stocksUpdateFailed: (dashboard, action) => {
      dashboard.stockUpdateStatus = "failed";
      dashboard.stockUpdating = false;
    },
    stockDeleteStarted: (dashboard, action) => {
      dashboard.stockDeleteStatus = "pending";
      dashboard.stockDeleting = true;
    },
    stockDeleted: (dashboard, action) => {
      dashboard.stockDeleteStatus = "success";
      dashboard.stockDeleting = false;
      const currentStock = dashboard.stocks;
      const stockIndex = currentStock.findIndex(
        (i) => i._id === action.payload._id
      );
      if (stockIndex !== -1) {
        currentStock.splice(stockIndex, 1);
      }
      dashboard.stocks = [...currentStock];
    },

    stocksDeleteFailed: (dashboard, action) => {
      dashboard.stockDeleteStatus = "failed";
      dashboard.stockDeleting = false;
    },
    transactionsRequested: (dashboard, action) => {
      dashboard.transactionsLoadingStatus = "pending";
      dashboard.transactionsLoading = true;
    },
    transactionsReceived: (dashboard, action) => {
      dashboard.transactions = action.payload;
      dashboard.transactionsLoadingStatus = "success";
      dashboard.transactionsLoading = false;
    },
    transactionsRequestFailed: (dashboard, action) => {
      dashboard.transactionsLoadingStatus = "failed";
      dashboard.transactionsLoading = false;
    },
    usersRequested: (dashboard, action) => {
      dashboard.usersLoadingStatus = "pending";
      dashboard.usersLoading = true;
    },
    usersReceived: (dashboard, action) => {
      dashboard.users = action.payload;
      dashboard.usersLoadingStatus = "success";
      dashboard.usersLoading = false;
    },
    usersRequestFailed: (dashboard, action) => {
      dashboard.usersLoadingStatus = "failed";
      dashboard.usersLoading = false;
    },
  },
});

export const {
  changeValue,
  stocksReceived,
  stocksRequestFailed,
  stocksRequested,
  transactionsReceived,
  transactionsRequestFailed,
  transactionsRequested,
  usersReceived,
  usersRequestFailed,
  usersRequested,
  stockUpdateStarted,
  stockUpdated,
  stocksUpdateFailed,
  stockAddFailed,
  stockAddStarted,
  stockAdded,
  stockDeleted,
  stockDeleteStarted,
  stocksDeleteFailed,
  userAddStarted,
  userAddFailed,
  userAdded,
} = slice.actions;

export default slice.reducer;

//Action creators
export const loadTransactions = (data) => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: "/transaction/get",
      method: "post",
      // params: params,
      data,
      onStart: transactionsRequested.type,
      onSuccess: transactionsReceived.type,
      onError: transactionsRequestFailed.type,
    })
  );
};
export const loadStocks = () => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: "/stock",
      method: "get",
      // params: params,
      onStart: stocksRequested.type,
      onSuccess: stocksReceived.type,
      onError: stocksRequestFailed.type,
    })
  );
};
export const addStock = (data) => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: `/stock/`,
      method: "post",
      data,
      onStart: stockAddStarted.type,
      onSuccess: stockAdded.type,
      onError: stockAddFailed.type,
    })
  );
};
export const updateStock = (id, data) => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: `/stock/${id}`,
      method: "patch",
      data,
      onStart: stockUpdateStarted.type,
      onSuccess: stockUpdated.type,
      onError: stocksUpdateFailed.type,
    })
  );
};
export const deleteStock = (id) => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: `/stock/${id}`,
      method: "delete",
      onStart: stockDeleteStarted.type,
      onSuccess: stockDeleted.type,
      onError: stocksDeleteFailed.type,
    })
  );
};
export const loadUsers = () => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: "/auth",
      method: "get",
      // params: params,
      onStart: usersRequested.type,
      onSuccess: usersReceived.type,
      onError: usersRequestFailed.type,
    })
  );
};
export const addUser = (data) => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: "/auth/add-worker",
      method: "post",
      // params: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      data,
      onStart: userAddStarted.type,
      onSuccess: userAdded.type,
      onError: userAddFailed.type,
    })
  );
};
export const changeDashboardValue = (key, value) => (dispatch, getState) => {
  dispatch({
    type: changeValue.type,
    payload: { key, value },
  });
};
