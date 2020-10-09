const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const users = require("./data/users");
const teams = require("./data/teams");

const User = require("./models/User");
const Team = require("./models/Team");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Team.deleteMany();

    await User.insertMany(users);
    await Team.insertMany(teams);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Team.deleteMany();
    await Fixture.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
