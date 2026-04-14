import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import './Sidebar.css'

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return (
    <div className='admin-sidebar'>
      {aToken && <ul className='sidebar-list'>
        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <img className='sidebar-icon dark:invert' src={assets.home_icon} alt='' />
          <p className='sidebar-text'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-appointments'} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <img className='sidebar-icon dark:invert' src={assets.appointment_icon} alt='' />
          <p className='sidebar-text'>Appointments</p>
        </NavLink>
        <NavLink to={'/add-doctor'} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <img className='sidebar-icon dark:invert' src={assets.add_icon} alt='' />
          <p className='sidebar-text'>Add Doctor</p>
        </NavLink>
        <NavLink to={'/doctor-list'} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <img className='sidebar-icon dark:invert' src={assets.people_icon} alt='' />
          <p className='sidebar-text'>Doctors List</p>
        </NavLink>
      </ul>}

      {dToken && <ul className='sidebar-list'>
        <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <img className='sidebar-icon dark:invert' src={assets.home_icon} alt='' />
          <p className='sidebar-text'>Dashboard</p>
        </NavLink>
        <NavLink to={'/doctor-appointments'} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <img className='sidebar-icon dark:invert' src={assets.appointment_icon} alt='' />
          <p className='sidebar-text'>Appointments</p>
        </NavLink>
        <NavLink to={'/doctor-medical-history'} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <img className='sidebar-icon dark:invert' src={assets.list_icon} alt='' />
          <p className='sidebar-text'>Medical History</p>
        </NavLink>
        <NavLink to={'/manage-availability'} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <img className='sidebar-icon dark:invert' src={assets.appointment_icon} alt='' />
          <p className='sidebar-text'>Manage Availability</p>
        </NavLink>
        <NavLink to={'/doctor-profile'} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <img className='sidebar-icon dark:invert' src={assets.people_icon} alt='' />
          <p className='sidebar-text'>Profile</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar