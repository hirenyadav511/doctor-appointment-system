import express from 'express';
import { updateAppointmentStatus } from '../controllers/appointmentController.js';
import authAdmin from '../middleware/authAdmin.js';
import authDoctor from '../middleware/authDoctor.js';
import authUser from '../middleware/authUser.js';

const appointmentRouter = express.Router();

// This route can be accessed by Admin, Doctor, or Patient
// We'll use a wrapper or handle multiple auths. 
// Since we want one endpoint, we can check for any of the tokens.

const authAny = async (req, res, next) => {
    const { token, dtoken, atoken } = req.headers;
    if (atoken) return authAdmin(req, res, next);
    if (dtoken) return authDoctor(req, res, next);
    if (token) return authUser(req, res, next);
    return res.json({ success: false, message: 'Not Authorized Login Again' });
}

appointmentRouter.put("/update-status/:id", authAny, updateAppointmentStatus);

export default appointmentRouter;
