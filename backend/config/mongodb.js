import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected"));

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "MongoDB connection string missing. Set MONGODB_URI (or MONGO_URI) in backend/.env",
    );
  }

  const hasDbName = /\/[^/?]+(\?|$)/.test(uri);
  const finalUri = hasDbName ? uri : `${uri.replace(/\/$/, "")}/prescripto`;

  await mongoose.connect(finalUri);
};

export default connectDB;
