const mongoose = require("mongoose");

const FixtureSchema = mongoose.Schema(
  {
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = Fixture = mongoose.model("Fixture", FixtureSchema);
