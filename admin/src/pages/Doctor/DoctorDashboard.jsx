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

  const statusColors = {
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Confirmed": "bg-green-100 text-green-800 border-green-200",
    "Consultation In Progress": "bg-blue-100 text-blue-800 border-blue-200",
    "Completed": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Cancelled": "bg-red-100 text-red-800 border-red-200"
  }

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-4'>
        <div className='flex-1 flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-52 cursor-pointer hover:shadow-md transition-all'>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
            <img className='w-10' src={assets.earning_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-bold text-gray-800 dark:text-white'>{currency} {dashData.earnings}</p>
            <p className='text-gray-500 dark:text-gray-400 font-medium mt-1'>Earnings</p>
          </div>
        </div>

        <div className='flex-1 flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-52 cursor-pointer hover:shadow-md transition-all'>
          <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
            <img className='w-10' src={assets.appointments_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-bold text-gray-800 dark:text-white'>{dashData.appointments}</p>
            <p className='text-gray-500 dark:text-gray-400 font-medium mt-1'>Appointments</p>
          </div>
        </div>

        <div className='flex-1 flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-52 cursor-pointer hover:shadow-md transition-all'>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
            <img className='w-10' src={assets.patients_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-bold text-gray-800 dark:text-white'>{dashData.patients}</p>
            <p className='text-gray-500 dark:text-gray-400 font-medium mt-1'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 mt-10 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
        <div className='flex items-center gap-2.5 px-6 py-5 rounded-t-xl border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'>
          <img src={assets.list_icon} className="dark:invert w-5" alt="" />
          <p className='font-semibold text-lg text-gray-800 dark:text-white'>Latest Bookings</p>
        </div>

        <div className='divide-y divide-gray-100 dark:divide-gray-700'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors' key={index}>
              <img className='rounded-full w-12 h-12 object-cover border dark:border-gray-600' src={item.userData.image} alt="" />
              <div className='flex-1'>
                <p className='text-gray-800 dark:text-white font-medium text-base'>{item.userData.name}</p>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <span className={`px-2 py-1 border rounded-full text-[10px] font-medium ${statusColors[item.status]}`}>
                  {item.status}
                </span>

                {item.status === "Pending" && (
                  <div className='flex gap-1'>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Confirmed')} className='text-[10px] bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'>Confirm</button>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[10px] bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'>Cancel</button>
                  </div>
                )}

                {item.status === "Confirmed" && (
                  <div className='flex gap-1'>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Consultation In Progress')} className='text-[10px] bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600'>Start Consultation</button>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[10px] bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'>Cancel</button>
                  </div>
                )}

                {item.status === "Consultation In Progress" && (
                  <button onClick={() => updateAppointmentStatus(item._id, 'Completed')} className='text-[10px] bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600'>Mark Completed</button>
                )}

                {item.status === "Completed" && (
                  <div className='flex flex-col gap-1 items-start'>
                    {item.isMedicalRecordAdded ? (
                      <p className='text-[10px] border border-green-500 bg-green-50 text-green-500 px-2 py-1 rounded'>
                        Record Added
                      </p>
                    ) : (
                      <button
                        onClick={() => setSelectedAppointment(item)}
                        className='text-[10px] border border-primary text-primary px-2 py-1 rounded hover:bg-primary hover:text-white transition-all'>
                        Add Record
                      </button>
                    )}
                  </div>
                )}
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