import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import DoctorAddMedicalRecord from '../../components/DoctorAddMedicalRecord'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment, updateAppointmentStatus } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  const [selectedAppointment, setSelectedAppointment] = React.useState(null)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  // Updated status colors for consistency
  const statusColors = {
    "Pending": "bg-yellow-50 text-yellow-600 border-yellow-100",
    "Confirmed": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Consultation In Progress": "bg-cyan-50 text-cyan-600 border-cyan-100",
    "Completed": "bg-green-50 text-green-700 border-green-100",
    "Cancelled": "bg-red-50 text-red-600 border-red-100"
  }

  return dashData && (
    <div className='m-5'>

      {/* Stats Section with Teal/Healthcare Theme */}
      <div className='flex flex-wrap gap-6 animate-slide-up'>
        <div className='flex-1 flex items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-50 min-w-56 hover:shadow-md transition-all'>
          <div className="p-4 bg-[#f0f9fa] rounded-2xl">
            <img className='w-10' src={assets.earning_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-extrabold text-gray-900'>{currency} {dashData.earnings}</p>
            <p className='text-gray-400 font-bold text-sm uppercase tracking-wider mt-1'>Earnings</p>
          </div>
        </div>

        <div className='flex-1 flex items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-50 min-w-56 hover:shadow-md transition-all'>
          <div className="p-4 bg-[#f0f9fa] rounded-2xl">
            <img className='w-10' src={assets.appointments_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-extrabold text-gray-900'>{dashData.appointments}</p>
            <p className='text-gray-400 font-bold text-sm uppercase tracking-wider mt-1'>Appointments</p>
          </div>
        </div>

        <div className='flex-1 flex items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-50 min-w-56 hover:shadow-md transition-all'>
          <div className="p-4 bg-[#f0f9fa] rounded-2xl">
            <img className='w-10' src={assets.patients_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-extrabold text-gray-900'>{dashData.patients}</p>
            <p className='text-gray-400 font-bold text-sm uppercase tracking-wider mt-1'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Table style list */}
      <div className='bg-white mt-10 rounded-2xl shadow-sm border border-slate-50 animate-slide-up'>
        <div className='flex items-center gap-3 px-8 py-6 rounded-t-2xl border-b border-slate-50 bg-slate-50/30'>
          <img src={assets.list_icon} className="w-5" alt="" />
          <p className='font-extrabold text-lg text-gray-800'>Recent Appointments</p>
        </div>

        <div className='divide-y divide-slate-50'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-8 py-5 gap-5 hover:bg-gray-50 transition-colors' key={index}>
              <img className='rounded-full w-14 h-14 object-cover border-2 border-slate-100 shadow-sm' src={item.userData.image} alt="" />
              <div className='flex-1'>
                <p className='text-gray-900 font-bold text-base'>{item.userData.name}</p>
                <p className='text-gray-400 font-medium text-sm'>Booking for {slotDateFormat(item.slotDate)}</p>
              </div>
              <div className='flex items-center gap-4'>
                <span className={`px-4 py-1.5 border rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColors[item.status]}`}>
                  {item.status}
                </span>

                <div className='flex gap-2'>
                    {item.status === "Pending" && (
                      <>
                        <button onClick={() => updateAppointmentStatus(item._id, 'Confirmed')} className='text-[11px] bg-emerald-500 text-white px-4 py-2 rounded-full font-bold hover:bg-emerald-600 shadow-sm'>Confirm</button>
                        <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[11px] bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600 shadow-sm'>Cancel</button>
                      </>
                    )}

                    {item.status === "Confirmed" && (
                      <>
                        <button onClick={() => updateAppointmentStatus(item._id, 'Consultation In Progress')} className='text-[11px] bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-primary/90 shadow-sm'>Start Consultation</button>
                        <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[11px] bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600 shadow-sm'>Cancel</button>
                      </>
                    )}

                    {item.status === "Consultation In Progress" && (
                      <button onClick={() => updateAppointmentStatus(item._id, 'Completed')} className='text-[11px] bg-green-600 text-white px-4 py-2 rounded-full font-bold hover:bg-green-700 shadow-sm'>Mark Completed</button>
                    )}

                    {item.status === "Completed" && (
                      <div className='flex items-center'>
                        {item.isMedicalRecordAdded ? (
                          <p className='text-[11px] border border-green-500 bg-green-50 text-green-600 px-4 py-1.5 rounded-full font-bold'>
                            Medical Record Added
                          </p>
                        ) : (
                          <button
                            onClick={() => setSelectedAppointment(item)}
                            className='text-[11px] border-2 border-primary text-primary px-4 py-1.5 rounded-full font-bold hover:bg-primary hover:text-white transition-all'>
                            + Add Record
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAppointment && (
        <DoctorAddMedicalRecord
          appointmentId={selectedAppointment._id}
          patientId={selectedAppointment.userId}
          onClose={() => setSelectedAppointment(null)}
          onSuccess={() => {
            getDashData()
          }}
        />
      )}

    </div>
  )
}

export default DoctorDashboard