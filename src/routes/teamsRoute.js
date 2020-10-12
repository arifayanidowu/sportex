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
const client = require("../utils/redis");

const router = express.Router();

const getAllTeamsCache = (req, res, next) => {
  client.get("teams", (err, reply) => {
    if (err) res.status(500).send(err);
    if (reply !== null) {
      return res.status(200).json(JSON.parse(reply));
    }
    next();
  });
};

router.route("/").post(protect, admin, createTeam);
router.get("/all", protect, getAllTeamsCache, getTeams);

router
  .route("/:id")
  .get(protect, admin, getCache, getTeamById)
  .put(protect, admin, updateTeam)
  .delete(protect, admin, deleteTeam);

module.exports = router;
