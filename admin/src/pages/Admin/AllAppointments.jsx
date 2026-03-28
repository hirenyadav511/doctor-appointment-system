import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, updateAppointmentStatus } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  const statusColors = {
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Confirmed": "bg-green-100 text-green-800 border-green-200",
    "Consultation In Progress": "bg-blue-100 text-blue-800 border-blue-200",
    "Completed": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Cancelled": "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_2fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status & Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_2fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img src={item.docData.image} className='w-8 rounded-full bg-gray-200' alt="" /> <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            <div className='flex items-center gap-2'>
              <span className={`px-2 py-1 border rounded-full text-[10px] font-medium ${statusColors[item.status]}`}>
                {item.status}
              </span>

              {item.status === "Pending" && (
                <div className='flex gap-1'>
                  <button onClick={() => updateAppointmentStatus(item._id, 'Confirmed')} className='text-[10px] bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-all'>Confirm</button>
                  <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[10px] bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all'>Cancel</button>
                </div>
              )}

              {item.status === "Confirmed" && (
                <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[10px] bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all'>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default AllAppointments