import medicalHistoryModel from "../models/MedicalHistory.js";
import appointmentModel from "../models/appointmentModel.js";

// Add medical history (Doctor Only)
const addMedicalHistory = async (req, res) => {
  try {
    // req.body.docId comes from authDoctor middleware
    const { docId, patientId, appointmentId, diagnosis, prescription, notes, visitDate } = req.body;

    if (!patientId || !appointmentId || !diagnosis || !prescription || !visitDate) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Verify if it's a valid appointment and if the doctor matches
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointment.docId !== docId) {
      return res.json({ success: false, message: "Not authorized for this appointment" });
    }

    // Prevent duplicate records for the same appointment
    if (appointment.isMedicalRecordAdded) {
      return res.json({ success: false, message: "Medical record already added for this appointment" });
    }

    const newHistory = new medicalHistoryModel({
      patientId,
      doctorId: docId,
      appointmentId,
      diagnosis,
      prescription,
      notes,
      visitDate: new Date(visitDate),
    });

    await newHistory.save();

    // Mark appointment as having a medical record
    await appointmentModel.findByIdAndUpdate(appointmentId, { isMedicalRecordAdded: true });

    res.json({ success: true, message: "Medical history added successfully", data: newHistory });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get medical history for a patient (Patient Only)
const getPatientHistory = async (req, res) => {
  try {
    const userId = req.body.userId;

    const history = await medicalHistoryModel.find({ patientId: userId }).populate("doctorId", "name speciality").populate("appointmentId", "slotDate slotTime").sort({ createdAt: -1 });
    res.json({ success: true, history });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get medical history for a doctor 
const getDoctorHistory = async (req, res) => {
  try {
    const docId = req.body.docId;

    const history = await medicalHistoryModel.find({ doctorId: docId }).populate("patientId", "name email image").populate("appointmentId", "slotDate slotTime").sort({ createdAt: -1 });
    res.json({ success: true, history });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete medical history (Doctor Only)
const deleteMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { docId } = req.body;

    const history = await medicalHistoryModel.findById(id);
    if (!history) {
      return res.json({ success: false, message: "Medical record not found" });
    }

    if (history.doctorId.toString() !== docId) {
      return res.json({ success: false, message: "Not authorized to delete this record" });
    }

    await medicalHistoryModel.findByIdAndDelete(id);

    // Unmark the appointment's medical record flag
    await appointmentModel.findByIdAndUpdate(history.appointmentId, { isMedicalRecordAdded: false });

    res.json({ success: true, message: "Medical record deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addMedicalHistory, getPatientHistory, getDoctorHistory, deleteMedicalHistory };
