import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 shadow-lg bg-white dark:bg-gray-800'>
        <p className='text-2xl font-semibold m-auto text-gray-800 dark:text-white'><span className='text-primary'>{state}</span> Login</p>
        <div className='w-full '>
          <p className='mb-1'>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-gray-300 dark:border-gray-600 rounded w-full p-2 bg-gray-50 dark:bg-gray-700 dark:text-white' type="email" required />
        </div>
        <div className='w-full '>
          <p className='mb-1'>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-gray-300 dark:border-gray-600 rounded w-full p-2 bg-gray-50 dark:bg-gray-700 dark:text-white' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base hover:shadow-lg transition-all'>Login</button>
        {
          state === 'Admin'
            ? <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Click here</span></p>
            : <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login