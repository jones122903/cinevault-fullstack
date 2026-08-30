const Actor = require("../models/Actor");
const { sendResponse } = require("../utils/response");
const cloudinary = require("../../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "cinevault/actors",
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

exports.getAllActors = async (req, res) => {
  try {
    const { name } = req.body;
    const filter = {};

    if (name) {
      filter.name = name;
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
    let image_public_id = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      image = result.secure_url;
      image_public_id = result.public_id;
    }

    const actor = await Actor.create({
      name,
      gender,
      dob,
      bio,
      image,
      image_public_id,
    });

    sendResponse(res, {
      statusCode: 201,
      data: actor,
      message: "Actor created successfully",
    });
  } catch (err) {
    console.error("Error creating actor:", err);

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

    const existingActor = await Actor.findById(actorId);

    if (!existingActor) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Actor not found",
      });
    }

    const dataToUpdate = {};

    if (name) dataToUpdate.name = name;
    if (gender) dataToUpdate.gender = gender;
    if (dob) dataToUpdate.dob = dob;
    if (bio) dataToUpdate.bio = bio;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      if (existingActor.image_public_id) {
        await cloudinary.uploader.destroy(existingActor.image_public_id);
      }

      dataToUpdate.image = result.secure_url;
      dataToUpdate.image_public_id = result.public_id;
    }

    const updatedActor = await Actor.findByIdAndUpdate(
      actorId,
      dataToUpdate
    );

    sendResponse(res, {
      data: updatedActor,
      message: "Actor updated successfully",
    });
  } catch (err) {
    console.error("Error updating actor:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteActor = async (req, res) => {
  try {
    const actorId = req.params.id;

    const actor = await Actor.findById(actorId);

    if (!actor) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Actor not found",
      });
    }

    // Delete image from Cloudinary
    if (actor.image_public_id) {
      await cloudinary.uploader.destroy(actor.image_public_id);
    }

    // Delete actor from database
    await Actor.findByIdAndDelete(actorId);

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