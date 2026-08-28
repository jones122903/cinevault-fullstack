const Movie = require("../models/Movie");
const { sendResponse } = require("../utils/response");
const cloudinary = require("../../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "cinevault/movies",
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

exports.getAllMovies = async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.body;

    const filter = {};

    if (name) {
      filter.name = name;
    }

    const offset = (page - 1) * limit;

    const movies = await Movie.find(filter, limit, offset);

    const db = require("../../database/db");

    const totalCount = await db("movies")
      .whereNull("deleted_at")
      .count("* as count")
      .first();

    sendResponse(res, {
      data: movies,
      total: totalCount.count,
      message: "Movies fetched successfully",
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

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Movie not found",
      });
    }

    sendResponse(res, {
      data: movie,
      message: "Movie fetched successfully",
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

exports.createMovie = async (req, res) => {
  try {
    const { name, yearOfRelease, plot, producer, actors } = req.body;

    let posterUrl = req.body.poster;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      posterUrl = result.secure_url;
    }

    if (name && name.length <= 30) {
      const existing = await Movie.find({ name });

      if (existing.length > 0) {
        return sendResponse(res, {
          statusCode: 400,
          status: "error",
          message: "Movie name must be unique",
        });
      }
    }

    const movie = await Movie.create({
      name,
      yearOfRelease,
      plot,
      poster: posterUrl,
      producer,
      actors,
    });

    sendResponse(res, {
      statusCode: 201,
      data: movie,
      message: "Movie created successfully",
    });
  } catch (err) {
    console.error("Error creating Movie:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { name, yearOfRelease, plot, producer, actors } = req.body;

    let posterUrl = req.body.poster;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      posterUrl = result.secure_url;
    }

    const dataToUpdate = {};

    if (name !== undefined) {
      dataToUpdate.name = name;
    }

    if (yearOfRelease !== undefined) {
      dataToUpdate.yearOfRelease = yearOfRelease;
    }

    if (plot !== undefined) {
      dataToUpdate.plot = plot;
    }

    if (posterUrl !== undefined) {
      dataToUpdate.poster = posterUrl;
    }

    if (producer !== undefined) {
      dataToUpdate.producer = producer;
    }

    if (actors !== undefined) {
      dataToUpdate.actors = actors;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      dataToUpdate
    );

    if (!updatedMovie) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Movie not found",
      });
    }

    sendResponse(res, {
      data: updatedMovie,
      message: "Movie updated successfully",
    });
  } catch (err) {
    console.error("Error updating Movie:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (!deletedMovie) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Movie not found",
      });
    }

    sendResponse(res, {
      data: { movieId },
      message: "Movie deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting Movie:", err);

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: "Failed to delete Movie",
    });
  }
};