const express = require("express");
const {
  createTeam,
  deleteTeam,
  updateTeam,
  getTeams,
  getTeamById,
} = require("../controllers/teamController");

const { protect, admin } = require("../middleware/auth");
const { getCache } = require("../utils/cache");

const router = express.Router();

router.route("/").post(protect, admin, createTeam);
router.get("/all", protect, getTeams);

router
  .route("/:id")
  .get(protect, admin, getCache, getTeamById)
  .put(protect, admin, updateTeam)
  .delete(protect, admin, deleteTeam);

module.exports = router;
