import { useNavigate } from "react-router";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo.svg";
import Title from "antd/es/typography/Title";
import Common from "../../common/common";
import "./Login.css";
import ToastOverlay from "../../components/ToastOverlay";
import { LoginUser } from "../../services/Index";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { toast, showToast } = Common();

  const onFinish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await LoginUser({ email, password });
      if (res.status == "success") {
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.token);
        localStorage.setItem(
          "userRole",
          res.data.name === "admin" ? "admin" : "user",
        );
        localStorage.setItem("userName", res.data.name);
        showToast(res?.message || "Something went wrong", res.status);
        setTimeout(() => {
          navigate("/actors");
        }, 1000);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img height={"50px"} src={logo} alt="logo" />
          </div>
          <Title level={3} className="login-title">
            Login
          </Title>
        </div>
        <form onSubmit={onFinish}>
          <div className="input-group">
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group password-group">
            <input
              type={passwordVisible ? "text" : "password"}
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
              {/* Show appropriate icon */}
            </span>
          </div>
          <div className="button-group">
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="signup-btn"
              onClick={() => navigate("/register")}
            >
              Sign Up
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
      <ToastOverlay message={toast.message} type={toast.type} />
    </div>
  );
};

export default Login;
