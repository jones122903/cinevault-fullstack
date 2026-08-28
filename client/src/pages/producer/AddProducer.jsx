import { useState } from "react";
import default_image from "../../assets/default_image.svg";
import Common from "../../common/common";
import { CreateProducer } from "../../services/Index";
import moment from "moment";
import "./AddProducer.css";
import { selectProducer } from "../../features/producer/producerSlice";
import { useSelector } from "react-redux";

const AddProducer = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { navigate, updateProducers, showToast } = Common();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: null,
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const { producers } = useSelector(selectProducer);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile({
        url: URL.createObjectURL(file),
        originFileObj: file,
      });
    }
  };

  const handleRemoveImage = () => setImageFile(null);

  const validate = () => {
    const validationErrors = {};
    if (!formData.name) validationErrors.name = "Name is required.";
    if (!formData.gender) validationErrors.gender = "Gender is required.";
    if (!formData.dob) validationErrors.dob = "Date of Birth is required.";
    if (!formData.bio) validationErrors.bio = "Bio is required.";
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("gender", formData.gender);
      fd.append("dob", formData.dob);
      fd.append("bio", formData.bio);
      if (imageFile) fd.append("image", imageFile.originFileObj);

      const res = await CreateProducer(fd);
      if (res.status == "success") {
        updateProducers([res.data, ...producers]);
        console.log(res.message || "Producer created successfully");
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
      } else if (err?.response?.data?.status == "field_error") {
        const errFields = {};
        error.response.data.err?.forEach((e) => {
          errFields[e.field] = e.message;
        });
        setErrors(errFields);
      } else {
        console.log(err?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-producer-overlay-wrapper">
      <div
        className="add-producer-overlay-background"
        onClick={() => navigate(-1)}
      />
      <div className="add-producer-overlay-content">
        <div className="add-producer-header">
          <h2>Add Producer</h2>
          <button
            onClick={() => navigate(-1)}
            className="add-producer-close-btn"
          >
            ×
          </button>
        </div>
        <div className="add-producer-body">
          <div className="add-producer-image-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="add-producer-file-input"
            />
            <img
              src={imageFile?.url || default_image}
              alt="preview"
              className="add-producer-image-preview"
            />
            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="add-producer-remove-btn"
              >
                Remove Image
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="add-producer-form-section">
            <div className="add-producer-form-row">
              <label className="add-producer-label">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="add-producer-input"
              />
              {errors.name && (
                <span className="add-producer-error">{errors.name}</span>
              )}
            </div>
            <div className="add-producer-form-row">
              <label className="add-producer-label">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="add-producer-input"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <span className="add-producer-error">{errors.gender}</span>
              )}
            </div>
            <div className="add-producer-form-row">
              <label className="add-producer-label">Date of Birth</label>
              <input
                type="date"
                value={formData.dob ? formData.dob.format("YYYY-MM-DD") : ""}
                onChange={(e) =>
                  setFormData({ ...formData, dob: moment(e.target.value) })
                }
                className="add-producer-input"
              />
              {errors.dob && (
                <span className="add-producer-error">{errors.dob}</span>
              )}
            </div>
            <div className="add-producer-form-row">
              <label className="add-producer-label">Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="add-producer-textarea"
              />
              {errors.bio && (
                <span className="add-producer-error">{errors.bio}</span>
              )}
            </div>
            <div className="add-producer-form-row">
              <button
                type="submit"
                disabled={loading}
                className="add-producer-submit-btn"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProducer;
