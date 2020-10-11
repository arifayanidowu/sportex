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
const cache = require("../utils/cache");

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createFixture)
  .get(protect, cache.route(), getAllFixtures);

router.get("/:status", cache.route(), getFixturesByStatus);
router.get("/fixture/:id", protect, admin, cache.route(), getFixture);

router
  .route("/:id")
  .put(protect, admin, updateFixture)
  .delete(protect, admin, deleteFixture);

module.exports = router;
