import React from "react";
import no_flag from "../assets/no_flag.svg";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import Common from "../common/common";
import "./MovieCard.css"; // Import the CSS file

const MovieCard = ({ data, setShowConfirm, setTargetMovie }) => {
  const { navigate } = Common();
  return (
    <div key={data.id} className="card">
      <img src={data.poster || no_flag} alt="Poster" className="card-poster" />
      <div className="card-content">
        <h3 className="card-title">{data.name || "-"}</h3>
        <p className="card-text">
          <strong>Actors:</strong>{" "}
          {data.actors?.map((actor) => actor.name).join(", ") || "-"}
        </p>
        <p className="card-text">
          <strong>Producer:</strong> {data.producer?.name || "-"}
        </p>
        <p className="card-text">
          <strong>Year:</strong> {data.yearOfRelease || "-"}
        </p>
        <div className="actions">
          <button
            className="primary-btn"
            onClick={() => navigate(`/movies/${data.id}`)}
          >
            <FiEye />
          </button>
          <button
            className="primary-btn"
            onClick={() => navigate(`/movies/edit/${data.id}`)}
          >
            <FiEdit />
          </button>
          <button
            onClick={() => {
              setTargetMovie(data);
              setShowConfirm(true);
            }}
            className="delete-btn"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
