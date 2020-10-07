const asyncHandler = require("express-async-handler");
const Fixture = require("../models/Fixture");

/**
 * @description Create Fixture
 * @route /api/fixtures
 * @method POST
 * @access Private/Admin
 */

const createFixture = asyncHandler(async (req, res) => {
  const { match, league, stadium } = req.body;

  const fixture = await Fixture.create({
    match,
    league,
    stadium,
  });
  if (fixture) {
    res.status(201).json(fixture);
  } else {
    res.status(404);
    throw new Error("Invalid data.");
  }
});

/**
 * @description Get All Fixtures
 * @route /api/fixtures
 * @method GET
 * @access Public
 */

const getAllFixtures = asyncHandler(async (req, res) => {
  const fixtures = await Fixture.find({});
  if (fixtures) {
    res.json(fixtures);
  } else {
    res.status(404);
    throw new Error("No data found.");
  }
});

/**
 * @description Get Fixtures by Status
 * @route /api/fixtures/:status
 * @method GET
 * @access Public
 */

const getFixturesByStatus = asyncHandler(async (req, res) => {
  const fixtures = await Fixture.find({ status: req.params.status });
  if (fixtures) {
    res.json(fixtures);
  } else {
    res.status(404);
    throw new Error("Invalid Data...");
  }
});

/**
 * @description Get Fixture by Id
 * @route /api/fixtures/:id
 * @method GET
 * @access Private/Admin
 */

const getFixture = asyncHandler(async (req, res) => {
  const fixture = await Fixture.findById(req.params.id);

  if (fixture) {
    res.json(fixture);
  } else {
    res.status(404);
    throw new Error("Invalid data...");
  }
});

/**
 * @description Update Fixture
 * @route /api/fixtures/:id
 * @method PUT
 * @access Private/Admin
 */

const updateFixture = asyncHandler(async (req, res) => {
  const fixture = await Fixture.findById(req.params.id);

  if (fixture) {
    fixture.match = req.body.match || fixture.match;
    fixture.league = req.body.league || fixture.league;
    fixture.status = req.body.status || fixture.status;
    fixture.stadium = req.body.stadium || fixture.stadium;
    const updatedFixture = await fixture.save();

    req.status(203).json(updatedFixture);
  } else {
    res.status(404);
    throw new Error("Invalid data.");
  }
});

/**
 * @description Search for Fixtures
 * @access Public
 * @route /api/fixtures/search
 * @method GET
 */

/**
 * @description Delete Fixture
 * @route /api/fixtures/:id
 * @method DELETE
 * @access Private/Admin
 */

const deleteFixture = asyncHandler(async (req, res) => {
  const fixture = await Fixture.findById(req.params.id);
  if (fixture) {
    await fixture.remove();
    res.json({ message: "Fixture removed" });
  } else {
    res.status(404);
    throw new Error("Invalid data.");
  }
});

module.exports = {
  createFixture,
  getAllFixtures,
  getFixturesByStatus,
  getFixture,
  updateFixture,
  deleteFixture,
};
