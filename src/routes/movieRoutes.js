const express = require("express");
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");
const router = express.Router();

router.post("/get-all", protect, getAllMovies);
router.get("/:id", protect, getMovieById);
router.post("/", protect, upload.single("poster"), createMovie);
router.put("/:id", protect, upload.single("poster"), updateMovie);
router.delete("/:id", protect, deleteMovie);

module.exports = router;
