import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import default_image from "../../assets/default_image.svg";
import { selectActor } from "../../features/actor/actorSlice";
import Common from "../../common/common";
import moment from "moment";
import "./ViewActor.css";

const ViewActor = () => {
  const { id } = useParams();
  const { actors = [] } = useSelector(selectActor);
  const { fetchActors, navigate } = Common();
  const [actor, setActor] = useState(null);

  const onLoad = async () => {
    const data = actors.find((d) => d.id == id);
    if (!data) await fetchActors();
    if (data) {
      setActor(actors.find((a) => a.id == id));
    }
  };

  useEffect(() => {
    onLoad();
  }, [id, actors]);

  return (
    <div className="view-actor-overlay-wrapper">
      <div
        className="view-actor-overlay-background"
        onClick={() => navigate(-1)}
      />
      <div className="view-actor-overlay-content">
        <div className="view-actor-header-row">
          <button onClick={() => navigate(-1)} className="view-actor-close-btn">
            ×
          </button>
          <h1 className="view-actor-page-title">Actor Details</h1>
          <h1 className="view-actor-page-title"> </h1>
        </div>
        <div className="view-actor-content">
          <div className="view-actor-image-section">
            <img
              src={actor?.image || default_image}
              alt="Actor"
              className="view-actor-image"
            />
          </div>
          <div className="view-actor-info-section">
            <div className="view-actor-info-row">
              <span className="view-actor-label">Name:</span>
              <span className="view-actor-value">{actor?.name || "N/A"}</span>
            </div>
            <div className="view-actor-info-row">
              <span className="view-actor-label">Gender:</span>
              <span className="view-actor-value">{actor?.gender || "N/A"}</span>
            </div>
            <div className="view-actor-info-row">
              <span className="view-actor-label">Date of Birth:</span>
              <span className="view-actor-value">
                {actor?.dob ? moment(actor.dob).format("MMMM D, YYYY") : "N/A"}
              </span>
            </div>
            <div className="view-actor-info-row">
              <span className="view-actor-label">Bio:</span>
              <span className="view-actor-value justify">
                {actor?.bio || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewActor;
