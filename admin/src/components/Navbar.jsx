import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { ThemeContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const { theme, toggleTheme } = useContext(ThemeContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className='admin-navbar animate-slide-up'>
      <div className='nav-brand'>
        <img onClick={() => navigate('/')} className='admin-logo' src={assets.admin_logo} alt="Admin Logo" />
        <span className='role-badge'>{aToken ? 'Admin' : 'Doctor'}</span>
      </div>
      
      <div className='nav-actions'>
        <button onClick={toggleTheme} className='theme-toggle-btn'>
          {theme === 'dark' ? (
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>
        <button onClick={() => logout()} className='admin-logout-btn'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar