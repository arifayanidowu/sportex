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

// const cache = require("../utils/cache");

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createFixture)
  .get(protect, admin, getAllFixtures);

router.get("/:status", getFixturesByStatus);
router.get("/fixture/:id", protect, admin, getCache, getFixture);

router
  .route("/:id")
  .put(protect, admin, updateFixture)
  .delete(protect, admin, deleteFixture);

module.exports = router;
