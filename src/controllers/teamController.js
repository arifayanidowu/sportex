const asyncHandler = require("express-async-handler");
const Team = require("../models/Team");
const errorHandler = require("../utils/errorHandler");

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
    return errorHandler(res, 400, "Team Already exists");
  }
  if (!name || !stadium) {
    return errorHandler(res, 401, "Team must have a name or stadium");
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
    return errorHandler(res, 404, "Invalid data.");
  }
});

/**
 * @description Get All teams
 * @route /api/teams/all
 * @method GET
 * @access Public
 */

const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({}).exec();

  if (teams) {
    res.status(200).json(teams);
  } else {
    return errorHandler(res, 404, "Invalid data");
  }
});

/**
 * @description Get Team by id
 * @route /api/teams/:id
 * @method GET
 * @access Private
 */

const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (team) {
    res.json(team);
  } else {
    return errorHandler(res, 404, "Team not Found.");
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
  } else {
    return errorHandler(res, 404, "Team not Found.");
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
    return errorHandler(res, 404, "Team not Found.");
  }
});

module.exports = {
  createTeam,
  deleteTeam,
  updateTeam,
  getTeams,
  getTeamById,
};
