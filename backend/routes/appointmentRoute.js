import express from "express";
import { updateAppointmentStatus } from "../controllers/appointmentController.js";
import authAdmin from "../middleware/authAdmin.js";
import authDoctor from "../middleware/authDoctor.js";
import authUser from "../middleware/authUser.js";

import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const appointmentRouter = express.Router();

const authAny = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Identify Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

    if (token_decode === adminEmail + adminPassword) {
      return next();
    }

    // Identify Doctor or User
    if (token_decode.id) {
      // Check if it's a doctor
      const isDoctor = await doctorModel.findById(token_decode.id);
      if (isDoctor) {
        req.body.docId = token_decode.id;
        return next();
      }

      // Check if it's a user
      const isUser = await userModel.findById(token_decode.id);
      if (isUser) {
        req.body.userId = token_decode.id;
        return next();
      }
    }

    return res.json({ success: false, message: "Not Authorized Login Again" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Authentication failed" });
  }
};

appointmentRouter.put("/update-status/:id", authAny, updateAppointmentStatus);

export default appointmentRouter;
