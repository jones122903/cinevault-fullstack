import React from "react";

import no_flag from "../assets/no_flag.svg";

import {
  FiEdit,
  FiEye,
  FiTrash2,
} from "react-icons/fi";

import Common from "../common/common";

import "./MovieCard.css";

const MovieCard = ({
  data,
  setShowConfirm,
  setTargetMovie,
}) => {
  const { navigate } = Common();

  const handleView = () => {
    navigate(
      `/movies/${data.id}`,
      {
        state: {
          movie: data,
        },
      }
    );
  };

  const handleEdit = () => {
    navigate(
      `/movies/edit/${data.id}`,
      {
        state: {
          movie: data,
        },
      }
    );
  };

  const handleDeleteClick = () => {
    setTargetMovie(data);
    setShowConfirm(true);
  };

  return (
    <div className="card">
      <img
        src={
          data.poster ||
          no_flag
        }
        alt={`${data.name || "Movie"} poster`}
        className="card-poster"
      />

      <div className="card-content">
        <h3 className="card-title">
          {data.name || "-"}
        </h3>

        <p className="card-text">
          <strong>
            Actors:
          </strong>{" "}
          {data.actors
            ?.map(
              (actor) =>
                actor.name
            )
            .join(", ") ||
            "-"}
        </p>

        <p className="card-text">
          <strong>
            Producer:
          </strong>{" "}
          {data.producer?.name ||
            "-"}
        </p>

        <p className="card-text">
          <strong>
            Year:
          </strong>{" "}
          {data.yearOfRelease ||
            "-"}
        </p>

        <div className="actions">
          <button
            type="button"
            className="primary-btn"
            onClick={handleView}
            aria-label={`View ${data.name}`}
          >
            <FiEye />
          </button>

          <button
            type="button"
            className="primary-btn"
            onClick={handleEdit}
            aria-label={`Edit ${data.name}`}
          >
            <FiEdit />
          </button>

          <button
            type="button"
            onClick={
              handleDeleteClick
            }
            className="delete-btn"
            aria-label={`Delete ${data.name}`}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;