const asyncHandler = require("express-async-handler");
const Team = require("../models/Team");
const client = require("../utils/redis");

/**
 * @description Create Team
 * @route /api/teams
 * @access Private/Admin
 * @method POST
 */

const createTeam = asyncHandler(async (req, res) => {
  const { name, stadium } = req.body;
  const teamExists = await Team.findOne({ name });
  if (teamExists) {
    res.status(400);
    throw new Error("Team Already exists");
  }
  const team = await Team.create({
    name,
    stadium,
  });

  if (team) {
    res.status(201).json({
      name,
      stadium,
    });
  } else {
    res.status(404);
    throw new Error("Invalid data.");
  }
});

/**
 * @description Get All teams
 * @route /api/teams
 * @method GET
 * @access Public
 */

const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({}).exec()
  res.status(200).json(teams);
  client.setex("teams", 3600, JSON.stringify(teams));
});

/**
 * @description Get Team by id
 * @route /api/teams/:id
 * @method GET
 * @access Public
 */

const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (team) {
    res.json(team);
    client.setex("team", 3600, JSON.stringify(team));
  } else {
    res.status(404);
    throw new Error("Team not Found");
  }
});

/**
 * @description Update Team
 * @route /api/teams/:id
 * @method PUT
 * @access Private/Admin
 */

const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (team) {
    team.name = req.body.name || team.name;
    team.stadium = req.body.stadium || team.stadium;
    const updatedTeam = await team.save();

    res.json({
      name: updatedTeam.name,
      stadium: updatedTeam.stadium,
      _id: updatedTeam._id,
    });
    client.setex("updatedTeam", 3600, JSON.stringify(updatedTeam));
  } else {
    res.status(404);
    throw new Error("Team not Found.");
  }
});

/**
 * @description Delete Team
 * @route /api/teams/:id
 * @method DELETE
 * @access Private/Admin
 */

const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (team) {
    await team.remove();
    res.json({ message: "Team removed" });
  } else {
    res.status(404);
    throw new Error("team not found");
  }
});

module.exports = {
  createTeam,
  deleteTeam,
  updateTeam,
  getTeams,
  getTeamById,
};
