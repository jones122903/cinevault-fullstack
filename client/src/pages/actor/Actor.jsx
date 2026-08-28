import { useEffect, useState } from "react";
import { DeleteActor } from "../../services/Index";
import Common from "../../common/common";
import { useSelector } from "react-redux";
import { selectActor } from "../../features/actor/actorSlice";
import SearchBar from "../../components/SearchBar";
import Card from "../../components/ProfileCard";
import ViewActorPage from "./ViewActor";
import EditActor from "./EditActor";
import AddActor from "./AddActor";
import "./Actors.css";

const Actors = ({ viewState, editState, addState }) => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetActor, setTarget] = useState(null);
  const {
    TokenRefreshedModal,
    fetchActors,
    navigate,
    updateActors,
    showToast,
  } = Common();
  const { actors } = useSelector(selectActor);

  useEffect(() => {
    if (!actors.length) fetchActors({ setLoading });
  }, []);

  const filteredActors = actors.filter((actor) =>
    actor.name?.toLowerCase().includes(filter.name?.toLowerCase() || ""),
  );

  const handleDelete = async (id) => {
    try {
      const res = await DeleteActor(id);
      if (res.status == "success") {
        const list = actors.filter((d) => d.id !== id);
        updateActors(list);
        showToast({
          message: res.message || "updated successfully",
          type: "success",
        });
      }
    } catch (err) {
      console.error(err);
      showToast({
        message: err?.response?.data?.message || "Something went wrong",
        type: "error",
      });
      if (err?.response?.data?.message == "Token refreshed") {
        TokenRefreshedModal();
      }
      console.log(err?.response?.data?.message || "Something went wrong.");
    }
  };

  const handleSearch = () => {
    setFilter({
      name: searchText,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      handleSearch();
    }, 1000);
  }, [searchText]);

  return (
    <div>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        path={"/actors/add"}
      />

      {loading ? (
        <div>Loading...</div>
      ) : actors.length > 0 ? (
        <div className="cardContainer">
          {filteredActors.map((item) => (
            <Card
              key={item.id}
              data={item}
              path={"actors"}
              setShowConfirm={setShowConfirm}
              setTarget={setTarget}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "16px" }}>
          No data available
        </div>
      )}

      {showConfirm && targetActor && (
        <div className="modalOverlay">
          <div className="modalBox">
            <p>
              Are you sure you want to delete{" "}
              <strong>{targetActor.name}</strong>?
            </p>
            <div className="modalActions">
              <button
                onClick={() => {
                  handleDelete(targetActor.id);
                  setShowConfirm(false);
                  setTarget(null);
                }}
                className="confirmBtn"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setTarget(null);
                }}
                className="cancelBtn"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {viewState && <ViewActorPage />}
      {editState && <EditActor />}
      {addState && <AddActor />}
    </div>
  );
};

export default Actors;
