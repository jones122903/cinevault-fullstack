import Common from "../../common/common";
import { useState, useEffect } from "react";
import { CreateMovie } from "../../services/Index";
import default_image from "../../assets/default_image.svg"; // Replace with actual path
import { useSelector } from "react-redux";
import { selectActor } from "../../features/actor/actorSlice";
import { selectProducer } from "../../features/producer/producerSlice";
import "./AddMovie.css";
import { selectMovie } from "../../features/movie/moviesSlice";

const AddMovie = () => {
  const [formData, setFormData] = useState({
    name: "",
    yearOfRelease: "",
    plot: "",
    producer: "",
    actors: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const { actors } = useSelector(selectActor);
  const { producers } = useSelector(selectProducer);

  const {
    TokenRefreshedModal,
    updateMovies,
    navigate,
    fetchActors,
    fetchProducers,
    showToast,
  } = Common();
  const { movies = [] } = useSelector(selectMovie);
  const onClose = () => {
    setFormData({
      name: "",
      yearOfRelease: "",
      plot: "",
      producer: "",
      actors: [],
    });
    setImageFile(null);
    setErrors({});
    navigate(-1);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onActorSelect = (e) => {
    const options = [...e.target.options];
    const selected = options.filter((o) => o.selected).map((o) => o.value);
    setFormData((prev) => ({ ...prev, actors: selected }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Movie name is required";
    if (!formData.yearOfRelease) newErrors.yearOfRelease = "Year is required";
    if (!formData.plot.trim()) newErrors.plot = "Plot is required";
    if (!formData.producer) newErrors.producer = "Producer is required";
    if (formData.actors.length == 0)
      newErrors.actors = "Select at least one actor";
    setErrors(newErrors);
    return Object.keys(newErrors).length == 0;
  };

  const onFinish = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("yearOfRelease", formData.yearOfRelease);
      data.append("plot", formData.plot);
      data.append("producer", formData.producer);
      formData.actors.forEach((id) => data.append("actors[]", id));
      if (imageFile) data.append("poster", imageFile);

      const res = await CreateMovie(data);
      if (res.status == "success") {
        const list = [res, ...movies];
        updateMovies(list);
        navigate(-1);
        showToast({
          message: res.message || "updated successfully",
          type: "success",
        });
      }
    } catch (err) {
      showToast({
        message: err?.response?.data?.message || "Something went wrong",
        type: "error",
      });
      if (err?.response?.data?.message == "Token refreshed") {
        TokenRefreshedModal();
      } else {
        console.log(err?.response?.data?.message || "Something went wrong");
      }
      console.log(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleActorSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (o) => o.value,
    );
    setFormData({ ...formData, actors: selectedOptions });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProducers(), fetchActors()])
      .catch(() => {}) // Handle any unhandled errors
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="add-movie-overlay">
      <div className="add-movie-drawer">
        <div className="add-movie-header">
          <h2>Add Movie</h2>
          <button onClick={onClose} className="add-movie-closeBtn">
            ×
          </button>
        </div>

        <div className="add-movie-card">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : default_image}
              alt="Poster"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
              }}
            />
          </div>

          <div className="add-movie-formGroup">
            <label>Poster</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="add-movie-uploadInput"
            />
          </div>

          <div className="add-movie-formGroup">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Enter movie name"
              className="add-movie-input"
            />
            {errors.name && (
              <span className="add-movie-error">{errors.name}</span>
            )}
          </div>

          <div className="add-movie-formGroup">
            <label>Year of Release</label>
            <input
              type="number"
              name="yearOfRelease"
              value={formData.yearOfRelease}
              onChange={onInputChange}
              placeholder="e.g., 2024"
              className="add-movie-input"
            />
            {errors.yearOfRelease && (
              <span className="add-movie-error">{errors.yearOfRelease}</span>
            )}
          </div>

          <div className="add-movie-formGroup">
            <label>Plot</label>
            <textarea
              name="plot"
              value={formData.plot}
              onChange={onInputChange}
              rows="4"
              placeholder="Enter movie plot"
              className="add-movie-textarea"
            />
            {errors.plot && (
              <span className="add-movie-error">{errors.plot}</span>
            )}
          </div>

          <div className="add-movie-formGroup">
            <label>Producer</label>
            <select
              name="producer"
              value={formData.producer}
              onChange={onInputChange}
              className="add-movie-input"
            >
              <option value="">Select Producer</option>
              {producers.map((producer) => (
                <option key={producer.id} value={producer.id}>
                  {producer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="add-movie-formGroup">
            <label>Actors</label>
            <div className="add-movie-tagInputWrapper">
              <div className="add-movie-tagContainer">
                {formData.actors.map((id) => {
                  const actor = actors.find((a) => a.id == id);
                  return (
                    <span key={id} className="add-movie-tag">
                      {actor?.name}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            actors: prev.actors.filter((aid) => aid !== id),
                          }))
                        }
                        className="add-movie-tagClose"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
                <input
                  type="text"
                  placeholder="Select actor..."
                  value=""
                  onFocus={() => setShowDropdown(true)}
                  readOnly
                  className="add-movie-tagInput"
                />
              </div>

              {showDropdown && (
                <div className="add-movie-dropdown">
                  {actors
                    .filter((actor) => !formData.actors.includes(actor.id))
                    .map((actor) => (
                      <div
                        key={actor.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            actors: [...prev.actors, actor.id],
                          }));
                          setShowDropdown(false);
                        }}
                        className="add-movie-dropdownItem"
                      >
                        {actor.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
            {errors.actors && (
              <span className="add-movie-error">{errors.actors}</span>
            )}
          </div>

          <div style={{ marginTop: "30px" }}>
            <button
              onClick={onFinish}
              className="add-movie-saveButton"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;
