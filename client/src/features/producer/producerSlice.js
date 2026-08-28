import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  producers: [],
};

export const producerSlice = createSlice({
  name: "producer",
  initialState,
  reducers: {
    producerActions: (state, action) => {
      return {
        producers: action.payload,
      };
    },
  },
});

export default producerSlice.reducer;

export const { producerActions } = producerSlice.actions;

export const selectProducer = (state) => state.producer;
