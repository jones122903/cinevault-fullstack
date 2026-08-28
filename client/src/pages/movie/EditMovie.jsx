import Common from "../../common/common";
import { useState, useEffect } from "react";
import { CreateMovie, UpdateMovie } from "../../services/Index";
import default_image from "../../assets/default_image.svg";
import { useSelector } from "react-redux";
import { selectActor } from "../../features/actor/actorSlice";
import { selectProducer } from "../../features/producer/producerSlice";
import { selectMovie } from "../../features/movie/moviesSlice";
import { useParams } from "react-router-dom";

const EditMovie = () => {
  const [formData, setFormData] = useState({
    name: "",
    yearOfRelease: "",
    plot: "",
    producer: "",
    actors: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const { actors } = useSelector(selectActor);
  const { producers } = useSelector(selectProducer);
  const { movies = [] } = useSelector(selectMovie);
  const { id } = useParams();

  const {
    TokenRefreshedModal,
    updateMovies,
    navigate,
    fetchActors,
    fetchProducers,
    fetchMovies,
    showToast,
  } = Common();

  useEffect(() => {
    const loadData = async () => {
      let data = movies.find((d) => d.id == id);
      if (!data) {
        await fetchMovies();
        data = movies.find((d) => d.id == id);
      }
      if (data) {
        setFormData({
          name: data.name,
          yearOfRelease: data.yearOfRelease,
          plot: data.plot,
          producer: data.producer.id,
          actors: data.actors?.map((actor) => actor.id) || [],
        });
        if (data.poster) {
          setPreviewURL(data.poster);
        }
      }
    };

    loadData();
  }, [id, movies]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProducers(), fetchActors()])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onClose = () => {
    setFormData({
      name: "",
      yearOfRelease: "",
      plot: "",
      producer: "",
      actors: [],
    });
    setImageFile(null);
    setPreviewURL(null);
    setErrors({});
    navigate(-1);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewURL(null);
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

      const res = await UpdateMovie(id, data);
      if (res.data.id == id) {
        console.log(res.message || "Movie updated successfully");
        const list = movies.map((d) => (d.id == id ? res.data : d));
        // updateMovies(list);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-movie-overlay">
      <div className="add-movie-drawer">
        <div className="add-movie-header">
          <h2>Edit Movie</h2>
          <button onClick={onClose} className="add-movie-closeBtn">
            ×
          </button>
        </div>

        <div className="add-movie-card">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <img
              src={previewURL || default_image}
              alt="Poster"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
            {previewURL && (
              <div>
                <button onClick={removeImage} className="add-movie-removeBtn">
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="add-movie-formGroup">
            <label>Poster</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
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
            {errors.producer && (
              <span className="add-movie-error">{errors.producer}</span>
            )}
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

export default EditMovie;
