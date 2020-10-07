const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    stadium: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Team = mongoose.model("Team", TeamSchema);
