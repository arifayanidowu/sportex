const asyncHandler = require("express-async-handler");
const Fixture = require("../models/Fixture");
const Team = require("../models/Team");
const { setCache } = require("../utils/cache");
const errorHandler = require("../utils/errorHandler");
const { generateLink } = require("../utils/generateLink");
const client = require("../utils/redis");

/**
 * @description Create Fixture
 * @route /api/fixtures
 * @method POST
 * @access Private/Admin
 */

const createFixture = asyncHandler(async (req, res) => {
  const { homeTeam, awayTeam } = req.body;

  if (homeTeam === awayTeam) {
    return errorHandler(res, 401, "A Single team cannot play against itself.");
  }

  let homeTeamData = await Team.findById(homeTeam);
  let awayTeamData = await Team.findById(awayTeam);

  if (!homeTeamData || !awayTeamData) {
    errorHandler(res, "One or both teams does not exist.");
  }
  const link = generateLink(req, homeTeamData.name, awayTeamData.name);
  const fixture = await Fixture.create({
    homeTeam,
    awayTeam,
    link,
  });
  if (fixture) {
    res.status(201).json(fixture);
  } else {
    return errorHandler(
      res,
      404,
      "Something went wrong while creating this data."
    );
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
      let link = fixture.link;

      return { _id: fixture._id, match, stadium, status, link };
    });
    res.json(newFixtures);

    setCache("fixtures", 3600, newFixtures);
  } else {
    return errorHandler(res, 404, "No data found.");
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

      let link = fixture.link;

      return { _id: fixture._id, match, stadium, status, link };
    });
    res.json(newFixtures);
    setCache("fixturesByStatus", 3600, newFixtures);
  } else {
    return errorHandler(res, 404, "Invalid data.");
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
    data.link = fixture.link;
    res.json(data);

    setCache("fixture", 3600, data);
  } else {
    return errorHandler(res, 404, "Invalid data.");
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
    return errorHandler(res, 404, "Invalid data.");
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
    return errorHandler(res, 404, "Invalid data.");
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
