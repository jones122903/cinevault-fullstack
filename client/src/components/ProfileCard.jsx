import React from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import default_image from "../assets/default_image.svg";
import Common from "../common/common";
import "./ProfileCard.css";

const ProfileCard = ({ data, path, setShowConfirm, setTarget }) => {
  const { navigate } = Common();

  return (
    <div key={data.id} className="card">
      <img
        src={data.image || default_image}
        alt="Avatar"
        className="cardAvatar"
      />
      <div className="cardContent">
        <h3 className="cardTitle">{data.name || "-"}</h3>
        <p className="cardText">Gender: {data.gender || "-"}</p>
        <p className="cardText">
          DOB: {data.dob ? new Date(data.dob).toLocaleDateString() : "-"}
        </p>
        <div className="actions">
          <button
            className="primaryBtn"
            onClick={() => navigate(`/${path}/${data.id}`)}
          >
            <FiEye />
          </button>
          <button
            className="primaryBtn"
            onClick={() => navigate(`/${path}/edit/${data.id}`)}
          >
            <FiEdit />
          </button>
          <button
            onClick={() => {
              setTarget(data);
              setShowConfirm(true);
            }}
            className="deleteBtn"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
