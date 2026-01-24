import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  }
};

export default Connection;
