const express = require("express");
const {
  createTeam,
  deleteTeam,
  updateTeam,
  getTeams,
  getTeamById,
} = require("../controllers/teamController");

const { protect, admin } = require("../middleware/auth");
const client = require("../utils/redis");
const router = express.Router();

const teamsCache = (req, res, next) => {
  client.get("teams", (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

const teamCache = (req, res, next) => {
  client.get("team", (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

const updatedTeamCache = (req, res, next) => {
  client.get("updatedTeamCache", (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

router
  .route("/")
  .post(protect, admin, createTeam)
  .get(protect, teamsCache, getTeams);

router
  .route("/:id")
  .get(protect, teamCache, getTeamById)
  .put(protect, admin, updatedTeamCache, updateTeam)
  .delete(protect, admin, deleteTeam);

module.exports = router;
