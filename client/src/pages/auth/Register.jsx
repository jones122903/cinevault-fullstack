import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RegisterUser } from "../../services/Index";
import { message } from "antd";
import Common from "../../common/common";
import "./Register.css"; // Assuming you want to use custom styles for this
import ToastOverlay from "../../components/ToastOverlay";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { toast, showToast } = Common();

  const onFinish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await RegisterUser({ name, email, password });
      showToast({
        message: res?.message,
        type: res.status,
      });
      navigate("/login");
    } catch (err) {
      showToast({
        message: err.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Register</h2>
        <form onSubmit={onFinish}>
          <div className="input-row">
            {/* Full Name Field */}
            <div className="input-group">
              <input
                type="text"
                className="register-input"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="input-group">
              <input
                type="email"
                className="register-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-row">
            {/* Password Field */}
            <div className="input-group password-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className="register-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="input-group password-group">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                className="register-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="button-group">
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          {/* Already have an account? */}
          <div className="button-group">
            <button
              type="button"
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Already have an account? Log in
            </button>
          </div>
        </form>
      </div>

      <div className="waves-wrp">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="waves">
            <use
              xlinkHref="#gentle-wave"
              x="50"
              y="0"
              fill="#689128"
              fillOpacity=".2"
            />
            <use
              xlinkHref="#gentle-wave"
              x="50"
              y="3"
              fill="#689128"
              fillOpacity=".5"
            />
            <use
              xlinkHref="#gentle-wave"
              x="50"
              y="6"
              fill="#689128"
              fillOpacity=".9"
            />
          </g>
        </svg>
      </div>

      <ToastOverlay
        message={toast.message}
        type={toast.type}
        onClose={() => showToast({ message: "", type: "" })}
      />
    </div>
  );
};

export default Register;
