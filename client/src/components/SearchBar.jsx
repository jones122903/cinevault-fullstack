import { FiSearch } from "react-icons/fi";
import Common from "../common/common";
import { IoIosPersonAdd } from "react-icons/io";
import "./SearchBar.css";

const SearchBar = ({ searchText, setSearchText, handleSearch, path }) => {
  const { navigate } = Common();
  return (
    <div className="search-bar-navbar">
      <button
        className="search-bar-icon-button"
        onClick={() => navigate(path)}
        title="Add Actor"
      >
        <IoIosPersonAdd />
      </button>
      <div className="search-bar-search-container">
        <input
          type="text"
          placeholder="Search Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-bar-input"
        />
        <button onClick={handleSearch} className="search-bar-search-button">
          <FiSearch style={{ marginRight: "4px" }} />
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
