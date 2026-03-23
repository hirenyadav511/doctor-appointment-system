import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-700'>
      {aToken && <ul className='text-gray-600 dark:text-gray-300 mt-5'>

        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-gray-800 border-r-4 border-primary text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <img className='min-w-5 dark:invert' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-gray-800 border-r-4 border-primary text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <img className='min-w-5 dark:invert' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/add-doctor'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-gray-800 border-r-4 border-primary text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <img className='min-w-5 dark:invert' src={assets.add_icon} alt='' />
          <p className='hidden md:block'>Add Doctor</p>
        </NavLink>
        <NavLink to={'/doctor-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-gray-800 border-r-4 border-primary text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <img className='min-w-5 dark:invert' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Doctors List</p>
        </NavLink>
      </ul>}

      {dToken && <ul className='text-gray-600 dark:text-gray-300 mt-5'>
        <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-gray-800 border-r-4 border-primary text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <img className='min-w-5 dark:invert' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/doctor-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-gray-800 border-r-4 border-primary text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <img className='min-w-5 dark:invert' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/doctor-medical-history'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-gray-800 border-r-4 border-primary text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <img className='min-w-5 dark:invert' src={assets.list_icon} alt='' />
          <p className='hidden md:block'>Medical History</p>
        </NavLink>
        <NavLink to={'/manage-availability'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-gray-800 border-r-4 border-primary text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <img className='min-w-5 dark:invert' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Manage Availability</p>
        </NavLink>
        <NavLink to={'/doctor-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-gray-800 border-r-4 border-primary text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <img className='min-w-5 dark:invert' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Profile</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar