const Producer = require("../models/Producer");
const { sendResponse } = require("../utils/response");
const cloudinary = require("../../config/cloudinary");

// =========================================
// Cloudinary upload helper
// =========================================
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "cinevault/producers",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// =========================================
// Get all producers
// =========================================
exports.getAllProducers = async (req, res) => {
  try {
    const { name } = req.body;

    const filter = {};

    if (name) {
      filter.name = name;
    }

    const producers = await Producer.find(filter);

    sendResponse(res, {
      data: producers,
      message: "Producers fetched successfully",
    });
  } catch (err) {
    console.error("Error fetching producers:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

// =========================================
// Create producer
// =========================================
exports.createProducer = async (req, res) => {
  try {
    const { name, gender, dob, bio } = req.body;

    let image = req.body.image || null;
    let image_public_id = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer
      );

      image = result.secure_url;
      image_public_id = result.public_id;
    }

    const producer = await Producer.create({
      name,
      gender,
      dob,
      bio,
      image,
      image_public_id,
    });

    sendResponse(res, {
      statusCode: 201,
      data: producer,
      message: "Producer created successfully",
    });
  } catch (err) {
    console.error("Error creating producer:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

// =========================================
// Update producer
// =========================================
exports.updateProducer = async (req, res) => {
  try {
    const producerId = req.params.id;

    const {
      name,
      gender,
      dob,
      bio,
      removeImage,
    } = req.body;

    const existingProducer =
      await Producer.findById(producerId);

    if (!existingProducer) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Producer not found",
      });
    }

    const dataToUpdate = {};

    // =====================================
    // Normal fields
    // =====================================

    if (name !== undefined) {
      dataToUpdate.name = name;
    }

    if (gender !== undefined) {
      dataToUpdate.gender = gender;
    }

    if (dob !== undefined) {
      dataToUpdate.dob = dob;
    }

    if (bio !== undefined) {
      dataToUpdate.bio = bio;
    }

    // =====================================
    // Case 1: New image selected
    // =====================================

    if (req.file) {
      let newImage;

      try {
        newImage = await uploadToCloudinary(
          req.file.buffer
        );

        dataToUpdate.image =
          newImage.secure_url;

        dataToUpdate.image_public_id =
          newImage.public_id;

        // Update DB first
        const updatedProducer =
          await Producer.findByIdAndUpdate(
            producerId,
            dataToUpdate
          );

        // Delete OLD Cloudinary asset
        if (
          existingProducer.image_public_id
        ) {
          try {
            await cloudinary.uploader.destroy(
              existingProducer.image_public_id
            );
          } catch (cloudinaryDeleteError) {
            console.error(
              "Failed to delete old producer image:",
              cloudinaryDeleteError
            );
          }
        }

        return sendResponse(res, {
          data: updatedProducer,
          message:
            "Producer updated successfully",
        });
      } catch (updateError) {
        // If new image uploaded but DB update failed,
        // clean up newly uploaded Cloudinary image.
        if (newImage?.public_id) {
          try {
            await cloudinary.uploader.destroy(
              newImage.public_id
            );
          } catch (cleanupError) {
            console.error(
              "Failed to clean up new producer image:",
              cleanupError
            );
          }
        }

        throw updateError;
      }
    }

    // =====================================
    // Case 2: Remove existing image
    // =====================================

    if (removeImage === "true") {
      dataToUpdate.image = null;
      dataToUpdate.image_public_id = null;

      // Update database first
      const updatedProducer =
        await Producer.findByIdAndUpdate(
          producerId,
          dataToUpdate
        );

      // Then delete old Cloudinary asset
      if (
        existingProducer.image_public_id
      ) {
        try {
          await cloudinary.uploader.destroy(
            existingProducer.image_public_id
          );
        } catch (cloudinaryDeleteError) {
          console.error(
            "Failed to delete producer image:",
            cloudinaryDeleteError
          );
        }
      }

      return sendResponse(res, {
        data: updatedProducer,
        message:
          "Producer image removed successfully",
      });
    }

    // =====================================
    // Case 3: Image unchanged
    // =====================================

    const updatedProducer =
      await Producer.findByIdAndUpdate(
        producerId,
        dataToUpdate
      );

    sendResponse(res, {
      data: updatedProducer,
      message: "Producer updated successfully",
    });
  } catch (err) {
    console.error("Error updating producer:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

// =========================================
// Delete producer
// =========================================
exports.deleteProducer = async (req, res) => {
  try {
    const producerId = req.params.id;

    const producer =
      await Producer.findById(producerId);

    if (!producer) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Producer not found",
      });
    }

    const hasMovies =
      await Producer.hasMovies(producerId);

    if (hasMovies) {
      return sendResponse(res, {
        statusCode: 400,
        status: "error",
        message:
          "Cannot delete producer because they are assigned to a movie",
      });
    }

    // Delete DB record first
    await Producer.findByIdAndDelete(
      producerId
    );

    // Delete Cloudinary asset
    if (producer.image_public_id) {
      try {
        await cloudinary.uploader.destroy(
          producer.image_public_id
        );
      } catch (cloudinaryDeleteError) {
        console.error(
          "Failed to delete producer image:",
          cloudinaryDeleteError
        );
      }
    }

    sendResponse(res, {
      data: { producerId },
      message: "Producer deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting producer:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: "Failed to delete producer",
    });
  }
};