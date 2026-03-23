import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment", required: true },
  diagnosis: { type: String, required: true },
  prescription: { type: String, required: true },
  notes: { type: String },
  visitDate: { type: Date, required: true },
}, { timestamps: true });

const medicalHistoryModel = mongoose.models.medicalHistory || mongoose.model("medicalHistory", medicalHistorySchema);
export default medicalHistoryModel;
