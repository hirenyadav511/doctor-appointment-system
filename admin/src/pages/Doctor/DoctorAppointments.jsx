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

  // Updated status colors for consistency
  const statusColors = {
    "Pending": "bg-yellow-50 text-yellow-600 border-yellow-100",
    "Confirmed": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Consultation In Progress": "bg-cyan-50 text-cyan-600 border-cyan-100",
    "Completed": "bg-green-50 text-green-700 border-green-100",
    "Cancelled": "bg-red-50 text-red-600 border-red-100"
  }

  return (
    <div className='w-full max-w-6xl m-5 animate-slide-up'>

      <p className='mb-4 text-xl font-bold text-gray-800 uppercase tracking-tight'>Doctor's Appointments</p>

      <div className='bg-white border-2 border-slate-50 rounded-2xl text-sm max-h-[82vh] overflow-y-scroll shadow-sm'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_0.8fr_2.5fr_1fr_2.2fr] gap-3 py-5 px-8 border-b bg-slate-50/50 font-bold text-gray-400 text-xs uppercase tracking-widest'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className='text-center'>Status & Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_0.8fr_2.5fr_1fr_2.2fr] gap-3 items-center text-gray-600 py-5 px-8 border-b hover:bg-gray-50 transition-colors' key={index}>
            <p className='max-sm:hidden font-medium text-gray-300'>{index + 1}</p>
            <div className='flex items-center gap-3'>
              <img src={item.userData.image} className='w-10 h-10 rounded-full border-2 border-slate-100 object-cover' alt="" /> 
              <p className='font-bold text-gray-800'>{item.userData.name}</p>
            </div>
            <div>
              <p className={`text-[10px] font-bold px-3 py-1 rounded-full inline-block ${item.payment ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                {item.payment ? 'ONLINE' : 'CASH'}
              </p>
            </div>
            <p className='max-sm:hidden font-bold'>{calculateAge(item.userData.dob)}</p>
            <p className='font-medium'>{slotDateFormat(item.slotDate)}, <span className='text-gray-400'>{item.slotTime}</span></p>
            <p className='font-bold text-gray-800 text-base'>{currency}{item.amount}</p>
            
            <div className='flex items-center justify-center gap-2'>
              <span className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[item.status]}`}>
                {item.status}
              </span>
              
              <div className='flex flex-wrap items-center gap-2'>
                {item.status === "Pending" && (
                  <>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Confirmed')} className='text-[10px] bg-emerald-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-emerald-600 shadow-sm transition-all'>Confirm</button>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[10px] bg-red-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-red-600 shadow-sm transition-all'>Cancel</button>
                  </>
                )}

                {item.status === "Confirmed" && (
                  <>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Consultation In Progress')} className='text-[10px] bg-primary text-white px-3 py-1.5 rounded-full font-bold hover:bg-primary/90 shadow-sm transition-all'>Start</button>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[10px] bg-red-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-red-600 shadow-sm transition-all'>Cancel</button>
                  </>
                )}

                {item.status === "Consultation In Progress" && (
                  <button onClick={() => updateAppointmentStatus(item._id, 'Completed')} className='text-[10px] bg-green-600 text-white px-4 py-1.5 rounded-full font-bold hover:bg-green-700 shadow-sm transition-all'>Finish</button>
                )}

                {item.status === "Completed" && (
                  <div className='flex flex-col gap-1 items-start'>
                    {item.isMedicalRecordAdded ? (
                      <p className='text-[10px] border border-green-500 bg-green-50 text-green-600 px-4 py-1.5 rounded-full font-bold'>
                        Record Added
                      </p>
                    ) : (
                      <button 
                        onClick={() => setSelectedAppointment(item)} 
                        className='text-[10px] border-2 border-primary text-primary px-4 py-1.5 rounded-full font-bold hover:bg-primary hover:text-white transition-all'>
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