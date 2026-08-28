import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  movies: [],
};

export const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    movieActions: (state, action) => {
      return {
        movies: action.payload,
      };
    },
  },
});

export default movieSlice.reducer;

export const { movieActions } = movieSlice.actions;

export const selectMovie = (state) => state.movie;
