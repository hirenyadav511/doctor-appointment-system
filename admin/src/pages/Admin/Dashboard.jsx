import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-4'>
        <div className='flex-1 flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-52 cursor-pointer hover:shadow-md transition-all'>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
            <img className='w-10' src={assets.doctor_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-bold text-gray-800 dark:text-white'>{dashData.doctors}</p>
            <p className='text-gray-500 dark:text-gray-400 font-medium mt-1'>Doctors</p>
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
              <img className='rounded-full w-12 h-12 object-cover border dark:border-gray-600' src={item.docData.image} alt="" />
              <div className='flex-1'>
                <p className='text-gray-800 dark:text-white font-medium text-base'>{item.docData.name}</p>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <span className='bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 py-1 px-3 rounded-full text-xs font-medium'>Cancelled</span>
                : item.isCompleted
                  ? <span className='bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 py-1 px-3 rounded-full text-xs font-medium'>Completed</span>
                  : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer hover:scale-110 transition-transform' src={assets.cancel_icon} alt="Cancel" />
              }
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard