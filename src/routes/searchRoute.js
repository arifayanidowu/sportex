const express = require("express");
const Fixture = require("../models/Fixture");
const Team = require("../models/Team");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { filter } = req.query;

  console.log(filter);

  const teams = await Team.find({}).exec();
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
    let filteredSearch = teams.concat(newFixtures);
    let results = filteredSearch.filter((item) => {
      if (filter) {
        return (
          (item.name &&
            item.name
              .toString()
              .toLowerCase()
              .indexOf(filter && filter.toLowerCase()) !== -1) ||
          (item.match &&
            item.match
              .toString()
              .toLowerCase()
              .indexOf(filter && filter.toLowerCase()) !== -1) ||
          (item.status &&
            item.status
              .toString()
              .toLowerCase()
              .indexOf(filter && filter.toLowerCase()) !== -1)
        );
      } else {
        return item;
      }
    });
    res.json(results);
  } else {
    res.status(404);
    throw new Error("Invalid Data...");
  }
});

module.exports = router;
