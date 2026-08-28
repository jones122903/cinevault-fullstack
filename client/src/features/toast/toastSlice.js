import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  toast: {
    message: "",
    type: "",
  },
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = {
        message: "",
        type: "",
      };
    },
  },
});

export default toastSlice.reducer;

export const { showToast, hideToast } = toastSlice.actions;

export const selectToast = (state) => state.toast;

export const showToastWithTimeout = (toast) => (dispatch) => {
  dispatch(showToast(toast));
  setTimeout(() => {
    dispatch(hideToast());
  }, 3000);
};