const asyncHandler = require("express-async-handler");
const Fixture = require("../models/Fixture");

/**
 * @description Create Fixture
 * @route /api/fixtures
 * @method POST
 * @access Private/Admin
 */

const createFixture = asyncHandler(async (req, res) => {
  const { homeTeam, awayTeam } = req.body;

  const fixture = await Fixture.create({
    homeTeam,
    awayTeam,
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
  const fixtures = await Fixture.find({})
    .sort({ _id: "desc" })
    .populate({ path: "homeTeam" })
    .populate({ path: "awayTeam" })
    .exec();
  if (fixtures) {
    let newFixtures = fixtures.map((fixture) => {
      let match = `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`;
      let stadium = `${fixture.homeTeam.stadium}`;
      let status = fixture.status;
      return { _id: fixture._id, match, stadium, status };
    });
    res.json(newFixtures);
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
  const fixtures = await Fixture.find({ status: req.params.status })
    .sort({
      _id: "desc",
    })
    .populate({ path: "homeTeam" })
    .populate({ path: "awayTeam" })
    .exec();
  if (fixtures) {
    let newFixtures = fixtures.map((fixture) => {
      let match = `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`;
      let stadium = `${fixture.homeTeam.stadium}`;
      let status = fixture.status;

      return { _id: fixture._id, match, stadium, status };
    });
    res.json(newFixtures);
  } else {
    res.status(404);
    throw new Error("Invalid Data...");
  }
});

/**
 * @description Get Fixture by Id
 * @route /api/fixtures/fixture/:id
 * @method GET
 * @access Private/Admin
 */

const getFixture = asyncHandler(async (req, res) => {
  const fixture = await Fixture.findById(req.params.id)
    .populate({ path: "homeTeam" })
    .populate({ path: "awayTeam" })
    .exec();

  if (fixture) {
    let data = {};
    data.match = `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`;
    data.stadium = `${fixture.homeTeam.stadium}`;
    data._id = fixture._id;
    data.status = fixture.status;
    res.json(data);
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
    fixture.homeTeam = req.body.homeTeam || fixture.homeTeam;
    fixture.awayTeam = req.body.awayTeam || fixture.awayTeam;
    fixture.status = req.body.status || fixture.status;

    const updatedFixture = await fixture.save();

    res.status(200).json(updatedFixture);
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
