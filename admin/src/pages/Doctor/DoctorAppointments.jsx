import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import DoctorAddMedicalRecord from '../../components/DoctorAddMedicalRecord'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, updateAppointmentStatus } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  
  const [selectedAppointment, setSelectedAppointment] = React.useState(null)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

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
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_2fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Status & Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_2fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment?'Online':'CASH'}
              </p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
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

      {selectedAppointment && (
        <DoctorAddMedicalRecord
          appointmentId={selectedAppointment._id}
          patientId={selectedAppointment.userId}
          onClose={() => setSelectedAppointment(null)}
          onSuccess={() => {
            getAppointments()
          }}
        />
      )}

    </div>
  )
}

export default DoctorAppointments