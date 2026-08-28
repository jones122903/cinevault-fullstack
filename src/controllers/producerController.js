const Producer = require("../models/Producer");
const { sendResponse } = require("../utils/response");
const cloudinary = require("../../config/cloudinary");

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
    console.error(err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

exports.createProducer = async (req, res) => {
  try {
    const { name, gender, dob, bio } = req.body;

    let image = req.body.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }

    const producer = await Producer.create({
      name,
      gender,
      dob,
      bio,
      image,
    });

    sendResponse(res, {
      statusCode: 201,
      data: producer,
      message: "Producer created successfully",
    });
  } catch (err) {
    console.error("Error creating Producer:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

exports.updateProducer = async (req, res) => {
  try {
    const { name, gender, dob, bio } = req.body;

    let image = req.body.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }

    const dataToUpdate = {};

    if (name) dataToUpdate.name = name;
    if (gender) dataToUpdate.gender = gender;
    if (dob) dataToUpdate.dob = dob;
    if (bio) dataToUpdate.bio = bio;
    if (image) dataToUpdate.image = image;

    const updatedProducer = await Producer.findByIdAndUpdate(
      req.params.id,
      dataToUpdate
    );

    if (!updatedProducer) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Producer not found",
      });
    }

    sendResponse(res, {
      data: updatedProducer,
      message: "Producer updated successfully",
    });
  } catch (err) {
    console.error("Error updating Producer:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: "Failed to update Producer",
    });
  }
};

exports.deleteProducer = async (req, res) => {
  try {
    const deletedProducer = await Producer.findByIdAndDelete(req.params.id);

    if (!deletedProducer) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Producer not found",
      });
    }

    sendResponse(res, {
      data: {
        producerId: req.params.id,
      },
      message: "Producer deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting Producer:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: "Failed to delete Producer",
    });
  }
};