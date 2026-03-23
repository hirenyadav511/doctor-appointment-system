import reviewModel from "../models/Review.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API to add doctor review
const addReview = async (req, res) => {
    try {
        const { userId, doctorId, appointmentId, rating, comment } = req.body;

        if (!rating || !comment || !appointmentId || !doctorId) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Check if appointment exists and is completed
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointment.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized access" });
        }

        if (appointment.status !== "Completed") {
            return res.json({ success: false, message: "Only completed appointments can be reviewed" });
        }

        if (appointment.isReviewed) {
            return res.json({ success: false, message: "You have already reviewed this appointment" });
        }

        // Add review
        const reviewData = {
            doctorId,
            patientId: userId,
            appointmentId,
            rating: Number(rating),
            comment
        };

        const newReview = new reviewModel(reviewData);
        await newReview.save();

        // Update appointment status to reviewed
        await appointmentModel.findByIdAndUpdate(appointmentId, { isReviewed: true });

        // Update doctor rating calculation
        const doctor = await doctorModel.findById(doctorId);
        const newReviewCount = doctor.reviewCount + 1;
        const newRating = ((doctor.rating * doctor.reviewCount) + Number(rating)) / newReviewCount;

        await doctorModel.findByIdAndUpdate(doctorId, {
            rating: newRating.toFixed(1),
            reviewCount: newReviewCount
        });

        res.json({ success: true, message: "Review added successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor reviews
const getDoctorReviews = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const reviews = await reviewModel.find({ doctorId }).populate('patientId', 'name image').sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get patient reviews
const getPatientReviews = async (req, res) => {
    try {
        const { userId } = req.body; // From authPatient middleware
        const reviews = await reviewModel.find({ patientId: userId }).populate('doctorId', 'name image speciality').sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addReview, getDoctorReviews, getPatientReviews };
