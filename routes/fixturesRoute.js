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

const router = express.Router();

const getFixturesCache = (req, res, next) => {
  getCache(res, "fixtures", next);
};

const getFixtureCache = (req, res, next) => {
  getCache(res, "fixture", next);
};

const getFixtureByStatusCache = (req, res, next) => {
  getCache(res, "fixturesByStatus", next);
};

router
  .route("/")
  .post(protect, admin, createFixture)
  .get(protect, getFixturesCache, getAllFixtures);

router.get("/:status", getFixtureByStatusCache, getFixturesByStatus);
router.get("/fixture/:id", protect, admin, getFixtureCache, getFixture);

router
  .route("/:id")
  .put(protect, admin, updateFixture)
  .delete(protect, admin, deleteFixture);

module.exports = router;
