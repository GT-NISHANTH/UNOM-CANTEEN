const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("SUCCESS: Connected to MongoDB Atlas");
  } catch (error) {
    console.error("ERROR: Failed to connect to MongoDB Atlas");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
