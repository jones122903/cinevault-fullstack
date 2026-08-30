import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useParams } from "react-router-dom";

import { UpdateProducer } from "../../services/Index";
import default_image from "../../assets/default_image.svg";
import Common from "../../common/common";

import {
  selectProducer,
} from "../../features/producer/producerSlice";

import "./EditProducer.css";

const EditProducer = () => {
  const { id } = useParams();

  const { producers = [] } =
    useSelector(selectProducer);

  const [loading, setLoading] =
    useState(false);

  const [imageFile, setImageFile] =
    useState(null);

  const [removeImage, setRemoveImage] =
    useState(false);

  const {
    fetchProducers,
    navigate,
    updateProducers,
    showToast,
  } = Common();

  const [formData, setFormData] =
    useState({
      name: "",
      gender: "",
      dob: null,
      bio: "",
    });

  /*
    Fetch producers only when
    Redux does not already have them.
  */
  useEffect(() => {
    if (producers.length === 0) {
      fetchProducers();
    }
  }, []);

  /*
    Populate the form from Redux.
  */
  useEffect(() => {
    const data = producers.find(
      (producer) =>
        producer.id == id
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
        name: "producer-image",
        status: "done",
        url: data.image,
      });
    } else {
      setImageFile(null);
    }

    setRemoveImage(false);
  }, [id, producers]);

  const handleFileChange = (e) => {
    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    setImageFile({
      url:
        URL.createObjectURL(file),
      originFileObj: file,
    });

    /*
      A new image means we are
      no longer removing the image.
    */
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setRemoveImage(true);
  };

  const handleClose = () => {
    navigate(-1);
  };

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

      const payload =
        new FormData();

      payload.append(
        "name",
        name
      );

      payload.append(
        "gender",
        gender
      );

      payload.append(
        "dob",
        dob
          ? dob.format(
              "YYYY-MM-DD"
            )
          : ""
      );

      payload.append(
        "bio",
        bio
      );

      /*
        New image selected.
      */
      if (
        imageFile?.originFileObj
      ) {
        payload.append(
          "image",
          imageFile.originFileObj
        );

        payload.append(
          "removeImage",
          "false"
        );
      }

      /*
        Existing image explicitly removed.
      */
      else if (removeImage) {
        payload.append(
          "removeImage",
          "true"
        );
      }

      /*
        Existing image unchanged.
      */
      else {
        payload.append(
          "removeImage",
          "false"
        );
      }

      const res =
        await UpdateProducer(
          id,
          payload
        );

      if (
        res?.data?.id == id
      ) {
        const list =
          producers.map(
            (producer) =>
              producer.id == id
                ? res.data
                : producer
          );

        updateProducers(list);

        showToast({
          message:
            res.message ||
            "Producer updated successfully",
          type: "success",
        });

        navigate(-1);
      }
    } catch (err) {
      console.error(
        "Producer update error:",
        err
      );

      showToast({
        message:
          err?.response?.data
            ?.message ||
          "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-producer-overlay-wrapper">
      <div
        className="edit-producer-overlay-background"
        onClick={handleClose}
      />

      <div className="edit-producer-overlay-content">
        <div className="edit-producer-header">
          <h2>
            Edit Producer
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="edit-producer-close-btn"
          >
            ×
          </button>
        </div>

        <div className="edit-producer-body">
          <div className="edit-producer-image-section">
            <input
              type="file"
              accept="image/*"
              onChange={
                handleFileChange
              }
              className="edit-producer-file-input"
            />

            <img
              src={
                imageFile?.url ||
                default_image
              }
              alt="Producer preview"
              className="edit-producer-image-preview"
            />

            {imageFile && (
              <button
                type="button"
                onClick={
                  handleRemoveImage
                }
                className="edit-producer-remove-btn"
              >
                Remove Image
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="edit-producer-form-section"
          >
            <div className="edit-producer-form-row">
              <label className="edit-producer-label">
                Name
              </label>

              <input
                type="text"
                value={
                  formData.name
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name:
                      e.target.value,
                  })
                }
                required
                className="edit-producer-input"
              />
            </div>

            <div className="edit-producer-form-row">
              <label className="edit-producer-label">
                Gender
              </label>

              <select
                value={
                  formData.gender
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender:
                      e.target.value,
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

            <div className="edit-producer-form-row">
              <label className="edit-producer-label">
                Bio
              </label>

              <textarea
                rows={4}
                value={
                  formData.bio
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio:
                      e.target.value,
                  })
                }
                required
                className="edit-producer-textarea"
              />
            </div>

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