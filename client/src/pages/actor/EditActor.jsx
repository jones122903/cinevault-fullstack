import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { UpdateActor } from "../../services/Index";
import default_image from "../../assets/default_image.svg";
import { selectActor } from "../../features/actor/actorSlice";
import { useParams } from "react-router-dom";
import Common from "../../common/common";
import "./EditActor.css";

const EditActor = () => {
  const { id } = useParams();
  const { actors = [] } = useSelector(selectActor);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { fetchActors, navigate, updateActors, showToast, toast } = Common();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: null,
    bio: "",
  });
  const [firstTime, setFirstTime] = useState(true);

  const onLoad = async () => {
    const data = actors.find((d) => d.id == id);
    if (!data && firstTime) await fetchActors();
    setFirstTime(false);
    if (data) {
      setFormData({
        name: data.name || "",
        gender: data.gender || "",
        dob: data.dob ? moment(data.dob) : null,
        bio: data.bio || "",
      });
      if (data.image) {
        setImageFile({
          uid: "-1",
          name: "actor-image",
          status: "done",
          url: data.image,
        });
      }
    } else if (!firstTime) {
      showToast({ message: "Actor Not Fount", type: "error" });
    }
  };
  useEffect(() => {
    onLoad();
  }, [id, actors]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { name, gender, dob, bio } = formData;
      let res;
      if (imageFile?.originFileObj) {
        const payload = new FormData();
        payload.append("name", name);
        payload.append("gender", gender);
        payload.append("dob", dob ? dob.format("YYYY-MM-DD") : "");
        payload.append("bio", bio);
        payload.append("image", imageFile.originFileObj);
        res = await UpdateActor(id, payload);
      } else {
        const payload = {
          name,
          gender,
          dob: dob ? dob.format("YYYY-MM-DD") : "",
          bio,
          image: imageFile?.url || null,
        };
        res = await UpdateActor(id, payload);
      }
      if (res.data.id == id) {
        showToast({
          message: res.message || "updated successfully",
          type: "success",
        });
        const list = actors.map((d) => (d.id == id ? res.data : d));
        updateActors(list);
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      showToast({
        message: err?.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlayWrapper">
      <div className="overlayBackground" onClick={() => navigate(-1)} />
      <div className="overlayContent">
        <div className="header">
          <h2>Edit Actor</h2>
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
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="input"
              />
            </div>
            <div className="formRow">
              <label className="label">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                required
                className="input"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="formRow">
              <label className="label">Date of Birth</label>
              <input
                type="date"
                value={formData.dob ? formData.dob.format("YYYY-MM-DD") : ""}
                onChange={(e) =>
                  setFormData({ ...formData, dob: moment(e.target.value) })
                }
                required
                className="input"
              />
            </div>
            <div className="formRow">
              <label className="label">Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                required
                className="textarea"
              />
            </div>
            <div className="formRow">
              <button type="submit" disabled={loading} className="submitBtn">
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditActor;
