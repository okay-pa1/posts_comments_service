import mongoose from "mongoose";

export const connect = () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database");
  } catch (err) {
    throw err;
  }
};
