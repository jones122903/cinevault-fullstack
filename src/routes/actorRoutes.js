const express = require("express");
const actorController = require("../controllers/actorController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");
const router = express.Router();

router.post("/get-all", protect, actorController.getAllActors);
router.post("/", protect, upload.single("image"), actorController.createActor);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  actorController.updateActor
);
router.delete("/:id", protect, actorController.deleteActor);

module.exports = router;
