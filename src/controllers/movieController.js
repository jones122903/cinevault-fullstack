const Movie = require("../models/Movie");
const { sendResponse } = require("../utils/response");
const cloudinary = require("../../config/cloudinary");
const db = require("../../database/db");

// =========================================
// Cloudinary upload helper
// =========================================

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

// =========================================
// Get all movies
// =========================================

exports.getAllMovies = async (req, res) => {
  try {
    const {
      name,
      page = 1,
      limit = 10,
    } = req.body;

    const filter = {};

    if (name) {
      filter.name = name;
    }

    const numericPage = Number(page);
    const numericLimit = Number(limit);

    const offset =
      (numericPage - 1) * numericLimit;

    const movies = await Movie.find(
      filter,
      numericLimit,
      offset
    );

    // Count only non-deleted movies
    let countQuery = db("movies")
      .whereNull("deleted_at");

    // Apply same search filter to total count
    if (name) {
      countQuery = countQuery.where(
        "name",
        "like",
        `%${name}%`
      );
    }

    const totalCount = await countQuery
      .count("* as count")
      .first();

    sendResponse(res, {
      data: movies,
      total: Number(totalCount.count),
      message: "Movies fetched successfully",
    });
  } catch (err) {
    console.error(
      "Error fetching movies:",
      err
    );

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

// =========================================
// Get movie by ID
// =========================================

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(
      req.params.id
    );

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
    console.error(
      "Error fetching movie:",
      err
    );

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

// =========================================
// Create movie
// =========================================

exports.createMovie = async (req, res) => {
  try {
    const {
      name,
      yearOfRelease,
      plot,
      producer,
      actors,
    } = req.body;

    let posterUrl = req.body.poster;
    let posterPublicId = null;

    // -----------------------------------------
    // Check movie name
    // -----------------------------------------

    if (name && name.length <= 30) {
      const existing = await Movie.find({
        name,
      });

      const duplicateMovie =
        existing.find(
          (movie) =>
            movie.name.toLowerCase() ===
            name.toLowerCase()
        );

      if (duplicateMovie) {
        return sendResponse(res, {
          statusCode: 400,
          status: "error",
          message:
            "Movie name must be unique",
        });
      }
    }

    // -----------------------------------------
    // Upload poster to Cloudinary
    // -----------------------------------------

    if (req.file) {
      const result =
        await uploadToCloudinary(
          req.file.buffer
        );

      posterUrl = result.secure_url;
      posterPublicId = result.public_id;
    }

    // -----------------------------------------
    // Create movie
    // -----------------------------------------

    const movie = await Movie.create({
      name,
      yearOfRelease,
      plot,
      poster: posterUrl,
      poster_public_id:
        posterPublicId,
      producer,
      actors,
    });

    sendResponse(res, {
      statusCode: 201,
      data: movie,
      message:
        "Movie created successfully",
    });
  } catch (err) {
    console.error(
      "Error creating movie:",
      err
    );

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

// =========================================
// Update movie
// =========================================

exports.updateMovie = async (req, res) => {
  try {
    const {
      name,
      yearOfRelease,
      plot,
      producer,
      actors,
    } = req.body;

    // -----------------------------------------
    // Get existing movie first
    // -----------------------------------------

    const existingMovie =
      await Movie.findById(
        req.params.id
      );

    if (!existingMovie) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Movie not found",
      });
    }

    const dataToUpdate = {};

    // -----------------------------------------
    // Normal movie fields
    // -----------------------------------------

    if (name !== undefined) {
      dataToUpdate.name = name;
    }

    if (yearOfRelease !== undefined) {
      dataToUpdate.yearOfRelease =
        yearOfRelease;
    }

    if (plot !== undefined) {
      dataToUpdate.plot = plot;
    }

    if (producer !== undefined) {
      dataToUpdate.producer =
        producer;
    }

    if (actors !== undefined) {
      dataToUpdate.actors = actors;
    }

    // -----------------------------------------
    // New poster uploaded
    // -----------------------------------------

    if (req.file) {
      let newCloudinaryImage;

      try {
        // 1. Upload new poster
        newCloudinaryImage =
          await uploadToCloudinary(
            req.file.buffer
          );

        // 2. Save new poster information
        dataToUpdate.poster =
          newCloudinaryImage.secure_url;

        dataToUpdate.poster_public_id =
          newCloudinaryImage.public_id;

        // 3. Update database
        const updatedMovie =
          await Movie.findByIdAndUpdate(
            req.params.id,
            dataToUpdate
          );

        /*
          4. Only after the database update succeeds,
             delete the OLD Cloudinary poster.

          Seeded movies generally have external TMDB
          URLs and no poster_public_id, so they will
          not be deleted from Cloudinary.
        */

        if (
          existingMovie.poster_public_id
        ) {
          try {
            await cloudinary.uploader.destroy(
              existingMovie.poster_public_id
            );
          } catch (
            cloudinaryDeleteError
          ) {
            console.error(
              "Failed to delete old Cloudinary poster:",
              cloudinaryDeleteError
            );
          }
        }

        return sendResponse(res, {
          data: updatedMovie,
          message:
            "Movie updated successfully",
        });
      } catch (updateError) {
        /*
          If the new Cloudinary image was uploaded
          but the database update failed, remove
          the newly uploaded image so it does not
          become an orphaned Cloudinary asset.
        */

        if (
          newCloudinaryImage?.public_id
        ) {
          try {
            await cloudinary.uploader.destroy(
              newCloudinaryImage.public_id
            );
          } catch (
            cleanupError
          ) {
            console.error(
              "Failed to clean up new Cloudinary poster:",
              cleanupError
            );
          }
        }

        throw updateError;
      }
    }

    // -----------------------------------------
    // No new poster uploaded
    // -----------------------------------------

    /*
      In this case we don't touch poster or
      poster_public_id.

      The existing poster remains unchanged.
    */

    const updatedMovie =
      await Movie.findByIdAndUpdate(
        req.params.id,
        dataToUpdate
      );

    sendResponse(res, {
      data: updatedMovie,
      message:
        "Movie updated successfully",
    });
  } catch (err) {
    console.error(
      "Error updating movie:",
      err
    );

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

// =========================================
// Delete movie
// =========================================

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    const deletedMovie =
      await Movie.findByIdAndDelete(
        movieId
      );

    if (!deletedMovie) {
      return sendResponse(res, {
        statusCode: 404,
        status: "error",
        message: "Movie not found",
      });
    }

    /*
      IMPORTANT:

      Movie.findByIdAndDelete() currently performs
      a SOFT DELETE by setting deleted_at.

      Therefore we intentionally keep the
      Cloudinary poster.

      If we later implement permanent deletion,
      that endpoint can delete:

      deletedMovie.poster_public_id

      from Cloudinary.
    */

    sendResponse(res, {
      data: {
        movieId,
      },
      message:
        "Movie deleted successfully",
    });
  } catch (err) {
    console.error(
      "Error deleting movie:",
      err
    );

    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message:
        "Failed to delete movie",
    });
  }
};