import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import doctorModel from "./models/doctorModel.js";

const resetPasswords = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.log("No MONGO_URI found in .env");
      process.exit(1);
    }
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("12345678", salt);

    const result = await doctorModel.updateMany({}, { $set: { password: hashedPassword } });

    console.log(`Successfully reset passwords for ${result.modifiedCount} doctors to: 12345678`);
    
    process.exit(0);

  } catch (error) {
    console.error("Error resetting passwords:", error);
    process.exit(1);
  }
};

resetPasswords();
