const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to mongodb ${mongoose.connection.host}`.bgMagenta.black
    );
  } catch (error) {
    console.log(`MongoDV Error ${error}`.bgGreen.white);
  }
};

module.exports = connectDB;
