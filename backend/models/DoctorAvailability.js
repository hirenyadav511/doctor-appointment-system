import mongoose from "mongoose";

const doctorAvailabilitySchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
  day: { type: String, required: true }, // Monday, Tuesday, etc.
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime: { type: String, required: true }, // e.g. "17:00"
  slotDuration: { type: Number, required: true, default: 30 }, // in minutes
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const doctorAvailabilityModel = mongoose.models.doctorAvailability || mongoose.model("doctorAvailability", doctorAvailabilitySchema);
export default doctorAvailabilityModel;
