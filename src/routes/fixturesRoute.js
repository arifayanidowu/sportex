const express = require("express");
const {
  createFixture,
  getAllFixtures,
  getFixturesByStatus,
  getFixture,
  updateFixture,
  deleteFixture,
} = require("../controllers/fixtureController");

const { protect, admin } = require("../middleware/auth");
const { getCache } = require("../utils/cache");
const client = require("../utils/redis");

const getAllFixturesCache = (req, res, next) => {
  client.get("fixtures", (err, reply) => {
    if (err) res.status(500).send(err);
    if (reply !== null) {
      return res.status(200).json(JSON.parse(reply));
    }
    next();
  });
};

const getAllStatusCache = (req, res, next) => {
  client.get("status", (err, reply) => {
    if (err) res.status(500).send(err);
    if (reply !== null) {
      return res.status(200).json(JSON.parse(reply));
    }
    next();
  });
};

// const cache = require("../utils/cache");

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createFixture)
  .get(protect, admin, getAllFixturesCache, getAllFixtures);

router.get("/:status", getAllStatusCache, getFixturesByStatus);
router.get("/fixture/:id", protect, admin, getCache, getFixture);

router
  .route("/:id")
  .put(protect, admin, updateFixture)
  .delete(protect, admin, deleteFixture);

module.exports = router;
