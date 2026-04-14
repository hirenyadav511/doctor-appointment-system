import React, { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, updateAppointmentStatus } =
    useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Updated status colors to match the Teal theme where appropriate
  const statusColors = {
    Pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
    Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Consultation In Progress": "bg-cyan-50 text-cyan-600 border-cyan-100",
    Completed: "bg-green-50 text-green-700 border-green-100",
    Cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-4 text-xl font-bold text-gray-800">All Appointments</p>

      <div className="bg-white border-2 border-slate-50 rounded-2xl text-sm max-h-[82vh] overflow-y-scroll shadow-sm">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_2fr] grid-flow-col py-4 px-6 border-b bg-slate-50/50 font-bold text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p className="text-center">Status & Action</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_2fr] items-center text-gray-600 py-4 px-6 border-b hover:bg-gray-50 transition-colors"
            key={index}
          >
            <p className="max-sm:hidden font-medium text-gray-400">
              {index + 1}
            </p>
            <div className="flex items-center gap-3">
              <img
                src={item.userData.image}
                className="w-9 h-9 rounded-full border-2 border-slate-100 object-cover"
                alt=""
              />
              <p className="font-bold text-gray-900">{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden font-medium">
              {calculateAge(item.userData.dob)}
            </p>
            <p className="font-medium">
              {slotDateFormat(item.slotDate)},{" "}
              <span className="text-gray-400">{item.slotTime}</span>
            </p>
            <div className="flex items-center gap-3">
              <img
                src={item.docData.image}
                className="w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-50 object-cover"
                alt=""
              />
              <p className="font-bold text-gray-900">{item.docData.name}</p>
            </div>
            <p className="font-bold text-gray-900">
              {currency}
              {item.amount}
            </p>
            <div className="flex items-center justify-center gap-3">
              <span
                className={`px-3 py-1 border rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColors[item.status]}`}
              >
                {item.status}
              </span>

              {item.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateAppointmentStatus(item._id, "Confirmed")
                    }
                    className="text-[11px] bg-emerald-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-emerald-600 shadow-sm transition-all"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() =>
                      updateAppointmentStatus(item._id, "Cancelled")
                    }
                    className="text-[11px] bg-red-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-red-600 shadow-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {item.status === "Confirmed" && (
                <button
                  onClick={() => updateAppointmentStatus(item._id, "Cancelled")}
                  className="text-[11px] bg-red-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-red-600 shadow-sm transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
