import React from "react";
import "./YesNoModal.css";

const YesNoModal = ({ visible, message, onYes, onNo }) => {
  if (!visible) return null;

  return (
    <div className="yes-no-modal-overlay">
      <div className="yes-no-modal">
        <p>{message}</p>
        <div className="actions">
          <button onClick={onYes} className="yes">Yes</button>
          <button onClick={onNo} className="no">No</button>
        </div>
      </div>
    </div>
  );
};

export default YesNoModal;
