import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
        navigate('/admin-dashboard')
      } else {
        toast.error(data.message)
      }

    } else if (state === 'Doctor') {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
        navigate('/doctor-dashboard')
      } else {
        toast.error(data.message)
      }

    } else if (state === 'Doctor Reset') {

      const { data } = await axios.post(backendUrl + '/api/doctor/reset-password', { email, password })
      if (data.success) {
        toast.success(data.message)
        setState('Doctor')
        setPassword('')
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 shadow-lg bg-white dark:bg-gray-800'>
        <p className='text-2xl font-semibold m-auto text-gray-800 dark:text-white'>
          <span className='text-primary'>{state === 'Doctor Reset' ? 'Reset' : state}</span> 
          {state === 'Doctor Reset' ? ' Password' : ' Login'}
        </p>
        <div className='w-full '>
          <p className='mb-1'>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-gray-300 dark:border-gray-600 rounded w-full p-2 bg-gray-50 dark:bg-gray-700 dark:text-white' type="email" required />
        </div>
        
        <div className='w-full relative'>
          <p className='mb-1'>{state === 'Doctor Reset' ? 'New Password' : 'Password'}</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-gray-300 dark:border-gray-600 rounded w-full p-2 bg-gray-50 dark:bg-gray-700 dark:text-white pr-10' type={showPassword ? "text" : "password"} required />
          <div 
            onClick={() => setShowPassword(!showPassword)} 
            className='absolute right-3 top-[34px] cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors'
          >
            {showPassword ? (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
               </svg>
            )}
          </div>
        </div>

        {state === 'Doctor' && (
          <p onClick={() => setState('Doctor Reset')} className='text-sm text-primary underline cursor-pointer -mt-1'>Forgot Password?</p>
        )}

        <button className='bg-primary text-white w-full py-2 rounded-md text-base hover:shadow-lg transition-all mt-2'>
          {state === 'Doctor Reset' ? 'Update Password' : 'Login'}
        </button>
        
        {
          state === 'Admin'
            ? <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Click here</span></p>
            : state === 'Doctor' 
              ? <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Click here</span></p>
              : <p>Back to <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Doctor Login</span></p>
        }
      </div>
    </form>
  )
}

export default Login