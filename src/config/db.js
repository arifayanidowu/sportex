const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const URI =
      process.env.NODE_ENV === "test"
        ? "mongodb://localhost:27017/testsportex"
        : process.env.MONGO_URI;
    const conn = await mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
