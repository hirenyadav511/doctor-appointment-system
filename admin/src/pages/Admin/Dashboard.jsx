import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import AdminAnalytics from "../../components/AdminAnalytics";
import AppointmentsChart from "../../components/AppointmentsChart";
import AppointmentStatusChart from "../../components/AppointmentStatusChart";

const Dashboard = () => {
  const {
    aToken,
    getDashData,
    cancelAppointment,
    dashData,
    analyticsData,
    getAnalyticsData,
  } = useContext(AdminContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
      getAnalyticsData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="m-5">
        {/* Analytics Summary & fixed Charts */}
        {analyticsData && (
          <div className="mb-8 flex flex-col gap-8 text-gray-800">
            <AdminAnalytics analytics={analyticsData} currency={currency} />

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 animate-slide-up">
                {/* Fixed: Use monthlyStats instead of monthlyData */}
                <AppointmentsChart data={analyticsData.monthlyStats} />
              </div>
              <div className="lg:w-1/3 animate-slide-up">
                <AppointmentStatusChart
                  completed={analyticsData.completedAppointments}
                  cancelled={analyticsData.cancelledAppointments}
                />
              </div>
            </div>
          </div>
        )}

        {/* Latest Bookings Section */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="flex items-center gap-2.5 px-6 py-5">
            <img className="w-5" src={assets.list_icon} alt="" />
            <p className="font-bold text-lg text-gray-800">Latest Bookings</p>
          </div>

          <div className="pt-2 border-t">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-colors"
                key={index}
              >
                <img
                  className="rounded-full w-12 h-12 border-2 border-slate-100 object-cover"
                  src={item.docData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-900 font-bold">{item.docData.name}</p>
                  <p className="text-gray-500 font-medium">
                    Scheduled on {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {item.cancelled ? (
                    <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                      Completed
                    </span>
                  ) : (
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-9 h-9 p-2 hover:bg-red-50 rounded-full cursor-pointer transition-all"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
