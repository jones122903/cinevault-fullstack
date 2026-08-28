import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  actors: [],
};

export const actorSlice = createSlice({
  name: "actor",
  initialState,
  reducers: {
    actorActions: (state, action) => {
      return {
        actors: action.payload,
      };
    },
  },
});

export default actorSlice.reducer;

export const { actorActions } = actorSlice.actions;

export const selectActor = (state) => state.actor;
