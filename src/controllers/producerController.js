const Producer = require("../models/Producer");
const { sendResponse } = require("../utils/response");

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
      image = `${req.protocol}://${
        req.get("X-Forwarded-Host") || req.get("Host")
      }/uploads/images/${req.file.filename}`;
    }

    const producer = await Producer.create({ name, gender, dob, bio, image });

    sendResponse(res, {
      statusCode: 201,
      data: producer,
      message: "Producer created successfully",
    });
  } catch (err) {
    console.log(err);
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
      image = `${req.protocol}://${
        req.get("X-Forwarded-Host") || req.get("Host")
      }/uploads/images/${req.file.filename}`;
    }
    
    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (gender) dataToUpdate.gender = gender;
    if (dob) dataToUpdate.dob = dob;
    if (bio) dataToUpdate.bio = bio;
    if (image) dataToUpdate.image = image;

    const updatedProducer = await Producer.findByIdAndUpdate(req.params.id, dataToUpdate);

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
      data: { producerId: req.params.id },
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
