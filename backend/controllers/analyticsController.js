import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API to get Admin Analytics
const getAdminAnalytics = async (req, res) => {
    try {
        const totalDoctors = await doctorModel.countDocuments();
        const totalPatients = await userModel.countDocuments();
        const totalAppointments = await appointmentModel.countDocuments();
        const completedAppointments = await appointmentModel.countDocuments({ status: "Completed" });
        const cancelledAppointments = await appointmentModel.countDocuments({ status: "Cancelled" });

        // Calculate Total Revenue from completed appointments
        const completedApps = await appointmentModel.find({ status: "Completed" });
        const totalRevenue = completedApps.reduce((acc, curr) => acc + curr.amount, 0);

        // Calculate Monthly Appointment Statistics for Charts
        // We use aggregation to group by year and month
        const monthlyStats = await appointmentModel.aggregate([
            {
                $project: {
                    month: { $month: { $toDate: "$date" } },
                    year: { $year: { $toDate: "$date" } }
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    appointments: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Map months to short names for frontend
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMonthlyStats = monthlyStats.map(stat => ({
            month: `${monthNames[stat._id.month - 1]} ${stat._id.year}`,
            appointments: stat.appointments
        })).slice(-6); // Last 6 months

        res.json({
            success: true,
            analytics: {
                totalDoctors,
                totalPatients,
                totalAppointments,
                completedAppointments,
                cancelledAppointments,
                totalRevenue,
                monthlyStats: formattedMonthlyStats
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getAdminAnalytics };
