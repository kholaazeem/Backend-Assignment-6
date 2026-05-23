import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set("bufferCommands", false);

const connectDb = async () => {
  try {
    if (!process.env.MONGOURI) {
      throw new Error("MONGOURI is missing in .env");
    }

    await mongoose.connect(process.env.MONGOURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Database connected successfully!");
    return true;
  } catch (error) {
    console.log("Database connection failed!", error.message);
    return false;
  }
};

export default connectDb;