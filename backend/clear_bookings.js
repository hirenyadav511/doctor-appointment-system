import mongoose from "mongoose";
import doctorModel from "./models/doctorModel.js";
import appointmentModel from "./models/appointmentModel.js";
import 'dotenv/config'

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGO_URI}`)
}

const clearData = async () => {
    await connectDB();

    // Clear slots_booked for ALL doctors to be safe and start fresh
    const updateResult = await doctorModel.updateMany({}, { slots_booked: {} });
    console.log(`Cleared doctor slots_booked. Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);

    // Clear APPOINTMENTS collection
    const deleteResult = await appointmentModel.deleteMany({});
    console.log(`Cleared all appointments. Deleted count: ${deleteResult.deletedCount}`);

    process.exit();
};

clearData();
