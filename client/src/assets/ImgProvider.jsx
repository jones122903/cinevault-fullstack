import PropTypes from "prop-types";
import Logo from "./logo.svg";
import SmallLogo from "./logo_icon.svg";

const ImgProvider = ({ name, className }) => {
  switch (name) {
    case "logo":
      return <img src={Logo} alt="Logo" className={className} />;
    case "small_logo":
      return <img src={SmallLogo} alt="Small Logo" className={className} />;
    default:
      return <img src="" alt={name} className={className} />;
  }
};

ImgProvider.propTypes = {
  name: PropTypes.oneOf(["logo", "small_logo", "login_banner"]),
  className: PropTypes.string,
};

export default ImgProvider;
