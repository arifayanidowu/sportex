const mongoose = require("mongoose");

const FixtureSchema = mongoose.Schema(
  {
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    link: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = Fixture = mongoose.model("Fixture", FixtureSchema);
