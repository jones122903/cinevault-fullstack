const Actor = require("../models/Actor");
const { sendResponse } = require("../utils/response");

exports.getAllActors = async (req, res) => {
  try {
    const { name } = req.body;
    const filter = {};

    if (name) {
      filter.name = name; // Model will handle like match
    }

    const actors = await Actor.find(filter);

    sendResponse(res, {
      data: actors,
      message: "Actors fetched successfully",
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

exports.createActor = async (req, res) => {
  try {
    const { name, gender, dob, bio } = req.body;
    let image = req.body.image;

    if (req.file) {
      image = `${req.protocol}://${
        req.get("X-Forwarded-Host") || req.get("Host")
      }/uploads/images/${req.file.filename}`;
    }

    const actor = await Actor.create({ name, gender, dob, bio, image });

    sendResponse(res, {
      statusCode: 201,
      data: actor,
      message: "Actor created successfully",
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

exports.updateActor = async (req, res) => {
  try {
    const actorId = req.params.id;
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

    const updatedActor = await Actor.findByIdAndUpdate(actorId, dataToUpdate);

    if (!updatedActor) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Actor not found",
      });
    }

    sendResponse(res, {
      data: updatedActor,
      message: "Actor updated successfully",
    });
  } catch (err) {
    console.error("Error updating actor:", err);
    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: "Failed to update actor",
    });
  }
};

exports.deleteActor = async (req, res) => {
  try {
    const actorId = req.params.id;

    const deletedActor = await Actor.findByIdAndDelete(actorId);

    if (!deletedActor) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Actor not found",
      });
    }

    sendResponse(res, {
      data: { actorId },
      message: "Actor deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting actor:", err);
    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: "Failed to delete actor",
    });
  }
};
