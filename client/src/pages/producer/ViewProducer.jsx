import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import default_image from "../../assets/default_image.svg";
import { selectProducer } from "../../features/producer/producerSlice";
import Common from "../../common/common";
import moment from "moment";
import "./ViewProducerPage.css";

const ViewProducerPage = () => {
  const { id } = useParams();
  const { producers = [] } = useSelector(selectProducer);
  const { fetchProducers, navigate } = Common();
  const [producer, setProducer] = useState(null);

  const onLoad = async () => {
    const data = producers.find((d) => d.id == id);
    if (!data) await fetchProducers();
    if (data) {
      setProducer(producers.find((a) => a.id == id));
    }
  };

  useEffect(() => {
    onLoad();
  }, [id, producers]);

  return (
    <div className="view-producer-overlay-wrapper">
      <div
        className="view-producer-overlay-background"
        onClick={() => navigate(-1)}
      />
      <div className="view-producer-overlay-content">
        <div className="view-producer-header-row">
          <button
            onClick={() => navigate(-1)}
            className="view-producer-close-btn"
          >
            ×
          </button>

          <h1 className="view-producer-page-title">Producer Details</h1>
          <h1 className="view-producer-page-title"> </h1>
        </div>
        <div className="view-producer-content">
          <div className="view-producer-image-section">
            <img
              src={producer?.image || default_image}
              alt="producer"
              className="view-producer-image"
            />
          </div>
          <div className="view-producer-info-section">
            <div className="view-producer-info-row">
              <span className="view-producer-label">Name:</span>
              <span className="view-producer-value">
                {producer?.name || "N/A"}
              </span>
            </div>
            <div className="view-producer-info-row">
              <span className="view-producer-label">Gender:</span>
              <span className="view-producer-value">
                {producer?.gender || "N/A"}
              </span>
            </div>
            <div className="view-producer-info-row">
              <span className="view-producer-label">Date of Birth:</span>
              <span className="view-producer-value">
                {producer?.dob
                  ? moment(producer.dob).format("MMMM D, YYYY")
                  : "N/A"}
              </span>
            </div>
            <div className="view-producer-info-row">
              <span className="view-producer-label">Bio:</span>
              <span className="view-producer-value">
                {producer?.bio || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducerPage;
