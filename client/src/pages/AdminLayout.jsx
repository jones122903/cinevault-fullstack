import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

import { MdPerson, MdGroups, MdMovie, MdLogout } from "react-icons/md";

import "./AdminLayout.css";

import ToastOverlay from "../components/ToastOverlay";
import YesNoModal from "../components/YesNoModal";
import Common from "../common/common";

const menuItems = [
  { label: "Actors", key: "/actors", icon: <MdPerson /> },
  { label: "Producers", key: "/producers", icon: <MdGroups /> },
  { label: "Movies", key: "/movies", icon: <MdMovie /> },
  { label: "Log Out", key: "/logout", icon: <MdLogout /> },
];

const AdminLayout = ({ children }) => {
  const { navigate, LogoutModal, toast, showToast } = Common();
  const location = useLocation();
  const [selectedMenuKey, setSelectedMenuKey] = useState("");
  const [showYesNo, setShowYesNo] = useState(false);

  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "guest";

  useEffect(() => {
    const current = menuItems.find((item) =>
      location.pathname.startsWith(item.key),
    );
    if (current) {
      setSelectedMenuKey(current.key);
    }
  }, [location.pathname]);

  const handleMenuClick = (key) => {
    if (key == "/logout") {
      setShowYesNo(true);
    } else {
      navigate(key);
      setSelectedMenuKey(key);
    }
  };

  const handleLogout = () => {
    setShowYesNo(false);
    LogoutModal();
    showToast({ message: "Logged out", type: "success" });
  };

  return (
    <div className="admin-layout">
      <div className="navbar">
        <div className="navbar-left">
          <img
            src={logo}
            alt="logo"
            className="logo"
            onClick={() => navigate("/")}
          />
          <div className="user-profile">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">({userRole})</span>
          </div>
        </div>
        <div className="navbar-right">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`navbar-item ${
                selectedMenuKey == item.key ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item.key)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <YesNoModal
        visible={showYesNo}
        message="Are you sure you want to log out?"
        onYes={handleLogout}
        onNo={() => setShowYesNo(false)}
      />

      <div className="content">
        {children}
        <ToastOverlay />
      </div>
    </div>
  );
};

export default AdminLayout;
