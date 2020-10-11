const express = require("express");
const {
  createTeam,
  deleteTeam,
  updateTeam,
  getTeams,
  getTeamById,
} = require("../controllers/teamController");

const { protect, admin } = require("../middleware/auth");
const cache = require("../utils/cache");
const router = express.Router();

router.route("/").post(protect, admin, createTeam);
router.get("/all", protect, cache.route(), getTeams);

router
  .route("/:id")
  .get(protect, admin, cache.route(), getTeamById)
  .put(protect, admin, cache.route(), updateTeam)
  .delete(protect, admin, deleteTeam);

module.exports = router;
