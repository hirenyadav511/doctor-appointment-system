import express from "express";
import { addMedicalHistory, getPatientHistory, getDoctorHistory, deleteMedicalHistory } from "../controllers/medicalHistoryController.js";
import authDoctor from "../middleware/authDoctor.js";
import authUser from "../middleware/authUser.js";

const medicalHistoryRouter = express.Router();

medicalHistoryRouter.post("/add", authDoctor, addMedicalHistory);
medicalHistoryRouter.get("/patient", authUser, getPatientHistory);
medicalHistoryRouter.get("/doctor", authDoctor, getDoctorHistory);
medicalHistoryRouter.delete("/:id", authDoctor, deleteMedicalHistory);

export default medicalHistoryRouter;
