import { configureStore } from "@reduxjs/toolkit";
import actorSlice from "../features/actor/actorSlice";
import producerSlice from "../features/producer/producerSlice";
import movieSlice from "../features/movie/moviesSlice";
import toastSlice from "../features/toast/toastSlice";

export default configureStore({
  reducer: {
    actor: actorSlice,
    movie: movieSlice,
    producer: producerSlice,
    toast: toastSlice,
  },
});
