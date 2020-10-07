const mongoose = require("mongoose");

const FixtureSchema = mongoose.Schema(
  {
    match: {
      type: String,
      required: true,
    },
    league: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    stadium: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Fixture = mongoose.model("Fixture", FixtureSchema);
