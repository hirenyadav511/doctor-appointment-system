import express from "express";
import { addReview, getDoctorReviews, getPatientReviews } from "../controllers/reviewController.js";
import authPatient from "../middleware/authUser.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", authPatient, addReview);
reviewRouter.get("/doctor/:doctorId", getDoctorReviews);
reviewRouter.get("/patient", authPatient, getPatientReviews);

export default reviewRouter;
