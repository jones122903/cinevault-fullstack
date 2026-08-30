import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { UpdateProducer } from "../../services/Index";
import default_image from "../../assets/default_image.svg";
import { useParams } from "react-router-dom";
import Common from "../../common/common";
import { selectProducer } from "../../features/producer/producerSlice";
import "./EditProducer.css";

const EditProducer = () => {
  const { id } = useParams();

  const { producers = [] } = useSelector(selectProducer);

  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  // Tracks whether user explicitly clicked Remove Image
  const [removeImage, setRemoveImage] = useState(false);

  const {
    fetchProducers,
    navigate,
    updateProducers,
    showToast,
  } = Common();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: null,
    bio: "",
  });

  // =========================================
  // Fetch producers once if Redux is empty
  // =========================================

  useEffect(() => {
    if (producers.length === 0) {
      fetchProducers();
    }
  }, []);

  // =========================================
  // Populate producer data
  // =========================================

  useEffect(() => {
    const data = producers.find(
      (producer) => producer.id == id
    );

    if (!data) {
      return;
    }

    setFormData({
      name: data.name || "",
      gender: data.gender || "",
      dob: data.dob
        ? moment(data.dob)
        : null,
      bio: data.bio || "",
    });

    if (data.image) {
      setImageFile({
        uid: "-1",
        name: "Producer-image",
        status: "done",
        url: data.image,
      });
    } else {
      setImageFile(null);
    }

    setRemoveImage(false);
  }, [id, producers]);

  // =========================================
  // Select new image
  // =========================================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImageFile({
      url: URL.createObjectURL(file),
      originFileObj: file,
    });

    // Selecting a new image cancels removal
    setRemoveImage(false);
  };

  // =========================================
  // Remove existing image
  // =========================================

  const handleRemoveImage = () => {
    setImageFile(null);

    // Tell backend to remove Cloudinary image
    setRemoveImage(true);
  };

  // =========================================
  // Submit
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const {
        name,
        gender,
        dob,
        bio,
      } = formData;

      // Always use FormData because this endpoint
      // supports multipart image uploads.
      const payload = new FormData();

      payload.append("name", name);
      payload.append("gender", gender);

      payload.append(
        "dob",
        dob
          ? dob.format("YYYY-MM-DD")
          : ""
      );

      payload.append("bio", bio);

      // =====================================
      // Case 1: New image selected
      // =====================================

      if (imageFile?.originFileObj) {
        payload.append(
          "image",
          imageFile.originFileObj
        );

        payload.append(
          "removeImage",
          "false"
        );
      }

      // =====================================
      // Case 2: Remove Image clicked
      // =====================================

      else if (removeImage) {
        payload.append(
          "removeImage",
          "true"
        );
      }

      // =====================================
      // Case 3: Existing image unchanged
      // =====================================

      else {
        payload.append(
          "removeImage",
          "false"
        );
      }

      const res = await UpdateProducer(
        id,
        payload
      );

      if (res.data.id == id) {
        showToast({
          message:
            res.message ||
            "Producer updated successfully",
          type: "success",
        });

        // Update Redux with backend response
        const list = producers.map(
          (producer) =>
            producer.id == id
              ? res.data
              : producer
        );

        updateProducers(list);

        navigate(-1);
      }
    } catch (err) {
      console.error(
        "Producer update error:",
        err
      );

      showToast({
        message:
          err?.response?.data?.message ||
          "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="edit-producer-overlay-wrapper">

      <div
        className="edit-producer-overlay-background"
        onClick={() => navigate(-1)}
      />

      <div className="edit-producer-overlay-content">

        {/* Header */}

        <div className="edit-producer-header">
          <h2>Edit Producer</h2>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="edit-producer-close-btn"
          >
            ×
          </button>
        </div>

        <div className="edit-producer-body">

          {/* =====================================
              Image
          ===================================== */}

          <div className="edit-producer-image-section">

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="edit-producer-file-input"
            />

            {imageFile?.url ? (
              <img
                src={imageFile.url}
                alt="Producer preview"
                className="edit-producer-image-preview"
              />
            ) : (
              <img
                src={default_image}
                alt="Default producer"
                className="edit-producer-image-preview"
              />
            )}

            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="edit-producer-remove-btn"
              >
                Remove Image
              </button>
            )}
          </div>

          {/* =====================================
              Form
          ===================================== */}

          <form
            onSubmit={handleSubmit}
            className="edit-producer-form-section"
          >

            {/* Name */}

            <div className="edit-producer-form-row">

              <label className="edit-producer-label">
                Name
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                required
                className="edit-producer-input"
              />
            </div>

            {/* Gender */}

            <div className="edit-producer-form-row">

              <label className="edit-producer-label">
                Gender
              </label>

              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value,
                  })
                }
                required
                className="edit-producer-input"
              >

                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>
            </div>

            {/* DOB */}

            <div className="edit-producer-form-row">

              <label className="edit-producer-label">
                Date of Birth
              </label>

              <input
                type="date"
                value={
                  formData.dob
                    ? formData.dob.format(
                        "YYYY-MM-DD"
                      )
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dob: moment(
                      e.target.value
                    ),
                  })
                }
                required
                className="edit-producer-input"
              />
            </div>

            {/* Bio */}

            <div className="edit-producer-form-row">

              <label className="edit-producer-label">
                Bio
              </label>

              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value,
                  })
                }
                required
                className="edit-producer-textarea"
              />
            </div>

            {/* Update */}

            <div className="edit-producer-form-row">

              <button
                type="submit"
                disabled={loading}
                className="edit-producer-submit-btn"
              >
                {loading
                  ? "Updating..."
                  : "Update"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProducer;