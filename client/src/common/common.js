import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  GetActor,
  GetProducers,
  GetMovie,
} from "../services/Index";

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

  // =========================
  // Logout
  // =========================
  const LogoutModal = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    navigate("/login");
  };

  // Temporary safe function because some components
  // already call TokenRefreshedModal()
  const TokenRefreshedModal = () => {
    console.log("Token refresh handling triggered");
  };

  // =========================
  // Toast
  // =========================
  const showToast = (toastMessage) => {
    dispatch(showToastWithTimeout(toastMessage));
  };

  // =========================
  // Generic Fetch Handler
  // Actors / Producers
  // =========================
  const handleFetch = async (
    apiCall,
    successAction,
    setLoading
  ) => {
    if (setLoading) {
      setLoading(true);
    }

    try {
      const res = await apiCall();

      const list =
        res?.data?.map((item) => ({
          ...item,
          key: item.id,
        })) || [];

      dispatch(successAction(list));

      return res;
    } catch (err) {
      console.error(err);

      if (err?.response?.status !== 500) {
        showToast({
          message:
            err?.response?.data?.message ||
            "Something went wrong",
          type: "error",
        });
      }

      return null;
    } finally {
      if (setLoading) {
        setLoading(false);
      }
    }
  };

  // =========================
  // Actors
  // =========================
  const fetchActors = ({ setLoading } = {}) => {
    return handleFetch(
      GetActor,
      actorActions,
      setLoading
    );
  };

  const updateActors = (list = []) => {
    dispatch(actorActions(list));
  };

  // =========================
  // Producers
  // =========================
  const fetchProducers = ({ setLoading } = {}) => {
    return handleFetch(
      GetProducers,
      producerActions,
      setLoading
    );
  };

  const updateProducers = (list = []) => {
    dispatch(producerActions(list));
  };

  // =========================
  // Movies
  // =========================
  const updateMovies = (list = []) => {
    dispatch(movieActions(list));
  };

  const fetchMovies = async ({
    page = 1,
    limit = 10,
    name = "",
    setLoading,
  } = {}) => {
    if (setLoading) {
      setLoading(true);
    }

    try {
      const res = await GetMovie({
        page,
        limit,
        name,
      });

      const list =
        res?.data?.map((item) => ({
          ...item,
          key: item.id,
        })) || [];

      updateMovies(list);

      return {
        total: Number(res?.total || 0),
        page,
        limit,
      };
    } catch (err) {
      console.error(err);

      if (
        err?.response?.data?.message ===
        "Token refreshed"
      ) {
        TokenRefreshedModal();
      } else if (
        err?.response?.status !== 500
      ) {
        showToast({
          message:
            err?.response?.data?.message ||
            "Failed to fetch movies",
          type: "error",
        });
      }

      return null;
    } finally {
      if (setLoading) {
        setLoading(false);
      }
    }
  };

  return {
    dispatch,
    navigate,

    LogoutModal,
    TokenRefreshedModal,

    fetchActors,
    updateActors,

    fetchProducers,
    updateProducers,

    fetchMovies,
    updateMovies,

    toast,
    showToast,
  };
};

export default Common;