import express from "express";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import authAdmin from "../middleware/authAdmin.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/stats", authAdmin, getAdminAnalytics);

export default analyticsRouter;
