import express from "express";
import { addAvailability, getDoctorAvailability, updateAvailability, deleteAvailability } from "../controllers/availabilityController.js";
import authDoctor from "../middleware/authDoctor.js";

const availabilityRouter = express.Router();

availabilityRouter.post("/add", authDoctor, addAvailability);
availabilityRouter.get("/:doctorId", getDoctorAvailability);
availabilityRouter.put("/update/:id", authDoctor, updateAvailability);
availabilityRouter.delete("/:id", authDoctor, deleteAvailability);

export default availabilityRouter;
