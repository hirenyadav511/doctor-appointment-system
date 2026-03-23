import React from 'react'
import { assets } from '../assets/assets'

const AdminAnalytics = ({ analytics, currency }) => {
  return (
    <div className='flex flex-wrap gap-4 mb-8'>
      <div className='flex-1 flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-52 hover:shadow-md transition-all'>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
          <img className='w-10' src={assets.doctor_icon} alt="" />
        </div>
        <div>
          <p className='text-3xl font-bold text-gray-800 dark:text-white'>{analytics.totalDoctors}</p>
          <p className='text-gray-500 dark:text-gray-400 font-medium mt-1'>Total Doctors</p>
        </div>
      </div>

      <div className='flex-1 flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-52 hover:shadow-md transition-all'>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
          <img className='w-10' src={assets.patients_icon} alt="" />
        </div>
        <div>
          <p className='text-3xl font-bold text-gray-800 dark:text-white'>{analytics.totalPatients}</p>
          <p className='text-gray-500 dark:text-gray-400 font-medium mt-1'>Total Patients</p>
        </div>
      </div>

      <div className='flex-1 flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-52 hover:shadow-md transition-all'>
        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
          <img className='w-10' src={assets.appointments_icon} alt="" />
        </div>
        <div>
          <p className='text-3xl font-bold text-gray-800 dark:text-white'>{analytics.totalAppointments}</p>
          <p className='text-gray-500 dark:text-gray-400 font-medium mt-1'>Total Appointments</p>
        </div>
      </div>

      <div className='flex-1 flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-52 hover:shadow-md transition-all'>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-full text-2xl font-bold text-yellow-600 dark:text-yellow-400 w-16 h-16 flex items-center justify-center">
          {currency}
        </div>
        <div>
          <p className='text-3xl font-bold text-gray-800 dark:text-white'>{currency}{analytics.totalRevenue.toLocaleString()}</p>
          <p className='text-gray-500 dark:text-gray-400 font-medium mt-1'>Total Revenue</p>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
