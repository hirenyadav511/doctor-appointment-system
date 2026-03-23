import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";

// API to update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { docId, userId } = req.body; // docId/userId set by auth middleware

        const appointment = await appointmentModel.findById(id);

        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // Role identification
        const isAdmin = !docId && !userId; // authAdmin doesn't set body IDs
        const isDoctor = !!docId && appointment.docId === docId;
        const isPatient = !!userId && appointment.userId === userId;

        // Role-based Status Workflow Rules
        let allowedStatuses = [];
        if (isAdmin) {
            allowedStatuses = ["Confirmed", "Cancelled"];
        } else if (isDoctor) {
            allowedStatuses = ["Confirmed", "Consultation In Progress", "Completed", "Cancelled"];
        } else if (isPatient) {
            allowedStatuses = ["Cancelled"];
        } else {
            return res.json({ success: false, message: "Unauthorized to update status" });
        }

        if (!allowedStatuses.includes(status)) {
            return res.json({ success: false, message: `Your role is not allowed to set status to ${status}` });
        }

        const currentStatus = appointment.status;

        // Transition Validation
        const validTransitions = {
            "Pending": ["Confirmed", "Cancelled"],
            "Confirmed": ["Consultation In Progress", "Cancelled"],
            "Consultation In Progress": ["Completed", "Cancelled"],
            "Completed": [],
            "Cancelled": []
        };

        if (!validTransitions[currentStatus].includes(status)) {
            return res.json({ success: false, message: `Invalid transition from ${currentStatus} to ${status}` });
        }

        // Additional Patient restriction: can only cancel if Pending or Confirmed
        if (isPatient && status === "Cancelled") {
            if (currentStatus !== "Pending" && currentStatus !== "Confirmed") {
                return res.json({ success: false, message: "Appointment cannot be cancelled at this stage" });
            }
        }

        // Handle Cancellation logic (releasing slots)
        if (status === "Cancelled") {
            const { docId: appDocId, slotDate, slotTime } = appointment;
            const doctorData = await doctorModel.findById(appDocId);
            let slots_booked = doctorData.slots_booked;
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(appDocId, { slots_booked });
        }

        appointment.status = status;
        await appointment.save();

        res.json({ success: true, message: `Appointment status updated to ${status}` });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { updateAppointmentStatus };
