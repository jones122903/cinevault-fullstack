import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetActor, GetProducers, GetMovie } from "../services/Index";
import { actorActions } from "../features/actor/actorSlice";
import { producerActions } from "../features/producer/producerSlice";
import { movieActions } from "../features/movie/moviesSlice";
import {
  selectToast,
  showToastWithTimeout,
} from "../features/toast/toastSlice";

const Common = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useSelector(selectToast);

  const LogoutModal = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // Generic Fetch Handler
  const handleFetch = async (apiCall, successAction, setLoading) => {
    if (setLoading) setLoading(true);
    try {
      const res = await apiCall();
      const list = res?.data?.map((item) => ({ ...item, key: item.id })) || [];
      dispatch(successAction(list));
    } catch (err) {
      console.error(err);

      if (err?.response?.status !== 500) {
        showToast({
          message: err?.response?.data?.message || "Something went wrong",
          type: "error",
        });
      }

      if (err?.response?.status === 500) {
        if (setLoading) setLoading(true);
        return;
      }
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // Fetch Actors
  const fetchActors = ({ setLoading } = {}) =>
    handleFetch(GetActor, actorActions, setLoading);

  // Update Actors
  const updateActors = (list = []) => {
    dispatch(actorActions(list));
  };

  // Fetch Producers
  const fetchProducers = ({ setLoading } = {}) =>
    handleFetch(GetProducers, producerActions, setLoading);

  // Update Producers
  const updateProducers = (list = []) => {
    dispatch(producerActions(list));
  };

  // Fetch Movies
  const fetchMovies = async ({ setLoading } = {}) => {
    if (setLoading) setLoading(true);
    try {
      const res = await GetMovie();
      const list = res?.data?.map((item) => ({ ...item, key: item.id })) || [];
      updateMovies(list);

      // Set success toast
      showToast({
        message: res?.message || "Movies fetched successfully!",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.message == "Token refreshed") {
        handleTokenExpired();
      } else {
        // Set error toast
        if (err?.response?.status !== 500) {
          showToast({
            message: err?.response?.data?.message || "Failed to fetch Movies",
            type: "error",
          });
        }
      }
      if (err?.response?.status === 500) {
        if (setLoading) setLoading(true);
        return;
      }
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // Update Movies
  const updateMovies = (list = []) => {
    dispatch(movieActions(list));
  };
  const showToast = (toastMessage) => {
    dispatch(showToastWithTimeout(toastMessage));
  };
  const onClose = () => {
    setToast({ message: "", type: "" });
  };

  return {
    dispatch,
    navigate,
    LogoutModal,
    TokenRefreshedModal: "",
    fetchActors,
    updateActors,
    fetchProducers,
    updateProducers,
    fetchMovies,
    updateMovies,
    toast,
    showToast,
    onClose,
  };
};

export default Common;
