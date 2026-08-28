import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMovie } from "../../features/movie/moviesSlice";
import Common from "../../common/common";
import no_flag from "../../assets/no_flag.svg";
import { Tag } from "antd";
import "./ViewMovie.css";

const ViewMovie = () => {
  const { id } = useParams();
  const { movies = [] } = useSelector(selectMovie);
  const { fetchMovies, navigate } = Common();
  const [movie, setMovie] = useState(null);

  const onLoad = async () => {
    const data = movies.find((m) => m.id == id);
    if (!data) await fetchMovies();
    const selected = movies.find((m) => m.id == id);
    if (selected) setMovie(selected);
  };

  useEffect(() => {
    onLoad();
  }, [id, movies]);

  return (
    <div className="viewmovie-overlay-wrapper">
      <div
        className="viewmovie-overlay-background"
        onClick={() => navigate(-1)}
      />
      <div className="viewmovie-overlay-content">
        <button className="viewmovie-close-btn" onClick={() => navigate(-1)}>
          ×
        </button>
        <h1 className="viewmovie-title">Movie Details</h1>

        <div className="viewmovie-content">
          <div className="viewmovie-image-section">
            <img
              src={movie?.poster || no_flag}
              alt="Movie Poster"
              className="viewmovie-image"
            />
          </div>
          <div className="viewmovie-info-section">
            <div className="viewmovie-info-row">
              <span className="label">Name:</span>
              <span className="value">{movie?.name || "N/A"}</span>
            </div>
            <div className="viewmovie-info-row">
              <span className="label">English Name:</span>
              <span className="value">{movie?.englishName || "N/A"}</span>
            </div>
            <div className="viewmovie-info-row">
              <span className="label">Year of Release:</span>
              <span className="value">{movie?.yearOfRelease || "N/A"}</span>
            </div>
            <div className="viewmovie-info-row">
              <span className="label">Producer:</span>
              <span className="value">{movie?.producer?.name || "N/A"}</span>
            </div>
            <div className="viewmovie-info-row">
              <span className="label">Actors:</span>
              <span className="value tag-wrap">
                {movie?.actors?.length > 0
                  ? movie.actors.map((actor) => (
                      <Tag key={actor.id}>{actor.name}</Tag>
                    ))
                  : "N/A"}
              </span>
            </div>
            <div className="viewmovie-info-row">
              <span className="label">Plot:</span>
              <span className="value">{movie?.plot || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMovie;
