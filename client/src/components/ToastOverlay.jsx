import React from "react";
import "./ToastOverlay.css";
import { useSelector } from "react-redux";
import { selectToast } from "../features/toast/toastSlice";

const ToastOverlay = () => {
  const { toast } = useSelector(selectToast);
  const { message, type } = toast;
  if (!message) return null;

  return (
    <div className={`toast-overlay ${type}`}>
      <div className="toast-message">
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ToastOverlay;
