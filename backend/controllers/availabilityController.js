import doctorAvailabilityModel from "../models/DoctorAvailability.js";

// Add availability
const addAvailability = async (req, res) => {
  try {
    const { docId, day, startTime, endTime, slotDuration } = req.body;

    if (!day || !startTime || !endTime || !slotDuration) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Check for overlapping availability
    const existing = await doctorAvailabilityModel.find({ doctorId: docId, day });
    
    // Simple overlap check (can be improved with time comparison)
    // For now, let's assume one availability entry per day for simplicity, 
    // or validate that new startTime/endTime doesn't fall within existing ones.
    
    const overlap = existing.some(avail => {
        return (startTime >= avail.startTime && startTime < avail.endTime) ||
               (endTime > avail.startTime && endTime <= avail.endTime) ||
               (startTime <= avail.startTime && endTime >= avail.endTime);
    });

    if (overlap) {
      return res.json({ success: false, message: "Availability overlaps with an existing schedule for this day" });
    }

    const newAvailability = new doctorAvailabilityModel({
      doctorId: docId,
      day,
      startTime,
      endTime,
      slotDuration,
    });

    await newAvailability.save();
    res.json({ success: true, message: "Availability added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get doctor availability
const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const availability = await doctorAvailabilityModel.find({ doctorId });
    res.json({ success: true, availability });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update availability
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { docId, day, startTime, endTime, slotDuration, isAvailable } = req.body;

    const availability = await doctorAvailabilityModel.findById(id);
    if (!availability) {
      return res.json({ success: false, message: "Availability not found" });
    }

    if (availability.doctorId.toString() !== docId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    await doctorAvailabilityModel.findByIdAndUpdate(id, {
      day,
      startTime,
      endTime,
      slotDuration,
      isAvailable,
    });

    res.json({ success: true, message: "Availability updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete availability
const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { docId } = req.body;

    const availability = await doctorAvailabilityModel.findById(id);
    if (!availability) {
      return res.json({ success: false, message: "Availability not found" });
    }

    if (availability.doctorId.toString() !== docId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    await doctorAvailabilityModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Availability deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addAvailability, getDoctorAvailability, updateAvailability, deleteAvailability };
