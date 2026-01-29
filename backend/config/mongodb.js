import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))

    // Support both env var names (older setups often used MONGO_URI)
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MongoDB connection string missing. Set MONGODB_URI (or MONGO_URI) in backend/.env");
    }

    // If user already provided a db name in the URI, don't append another one.
    // Otherwise default to the `prescripto` db.
    const hasDbName = /\/[^/?]+(\?|$)/.test(uri);
    const finalUri = hasDbName ? uri : `${uri.replace(/\/$/, "")}/prescripto`;

    await mongoose.connect(finalUri)

}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.