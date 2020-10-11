const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    stadium: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Team = mongoose.model("Team", TeamSchema);
