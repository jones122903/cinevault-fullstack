import { useState } from "react";
import moment from "moment";
import Common from "../../common/common";
import { CreateActor } from "../../services/Index";
import default_image from "../../assets/default_image.svg";
import { useSelector } from "react-redux";
import { selectActor } from "../../features/actor/actorSlice";
import "./AddActor.css";

const AddActor = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    bio: "",
  });
  const { actors = [] } = useSelector(selectActor);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const { TokenRefreshedModal, navigate, updateActors, showToast } = Common();

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length == 0;
  };

  const onFinish = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("gender", formData.gender);
      data.append("dob", moment(formData.dob).format("YYYY-MM-DD"));
      data.append("bio", formData.bio);
      if (imageFile?.file) {
        data.append("image", imageFile.file);
      }

      const res = await CreateActor(data);
      if (res.status == "success") {
        showToast({
          message: res.message || "Actor Added successfully",
          type: "success",
        });
        const list = [res.data, ...actors];
        updateActors(list);
        navigate(-1);
      }
    } catch (err) {
      console.log(err);
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
      navigate("/actors");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFinish();
  };

  return (
    <div className="overlayWrapper">
      <div className="overlayBackground" onClick={() => navigate(-1)} />
      <div className="overlayContent">
        <div className="header">
          <h2>Add Actor</h2>
          <button onClick={() => navigate(-1)} className="closeBtn">
            ×
          </button>
        </div>
        <div className="body">
          <div className="imageSection">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="fileInput"
            />
            <img
              src={imageFile?.url || default_image}
              alt="preview"
              className="imagePreview"
            />
            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="removeBtn"
              >
                Remove Image
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="formSection">
            <div className="formRow">
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                className="input"
              />
              {errors.name && (
                <span style={{ color: "red" }}>{errors.name}</span>
              )}
            </div>
            <div className="formRow">
              <label className="label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={onInputChange}
                className="input"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <span style={{ color: "red" }}>{errors.gender}</span>
              )}
            </div>
            <div className="formRow">
              <label className="label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={onInputChange}
                className="input"
              />
              {errors.dob && <span style={{ color: "red" }}>{errors.dob}</span>}
            </div>
            <div className="formRow">
              <label className="label">Bio</label>
              <textarea
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={onInputChange}
                className="textarea"
              />
              {errors.bio && <span style={{ color: "red" }}>{errors.bio}</span>}
            </div>
            <div className="formRow">
              <button type="submit" disabled={loading} className="submitBtn">
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddActor;
