import React, { useState, useEffect, useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const ManageAvailability = () => {
  const { backendUrl, dToken, profileData, getProfileData } = useContext(DoctorContext)
  
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [day, setDay] = useState('Monday')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [slotDuration, setSlotDuration] = useState(30)
  const [isAvailable, setIsAvailable] = useState(true)
  const [editId, setEditId] = useState(null)

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const fetchAvailability = async () => {
    try {
      if (!profileData?._id) return
      const { data } = await axios.get(`${backendUrl}/api/availability/${profileData._id}`)
      if (data.success) {
        setAvailability(data.availability)
      } else {
        toast.error(data.message)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const addAvailability = async (e) => {
    e.preventDefault()
    try {
      const url = editId 
        ? `${backendUrl}/api/availability/update/${editId}`
        : `${backendUrl}/api/availability/add`
      
      const method = editId ? 'put' : 'post'

      const { data } = await axios[method](
        url,
        { day, startTime, endTime, slotDuration, isAvailable },
        { headers: { dToken } }
      )
      if (data.success) {
        toast.success(data.message)
        resetForm()
        fetchAvailability()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const resetForm = () => {
    setEditId(null)
    setDay('Monday')
    setStartTime('09:00')
    setEndTime('17:00')
    setSlotDuration(30)
    setIsAvailable(true)
  }

  const handleEdit = (item) => {
    setEditId(item._id)
    setDay(item.day)
    setStartTime(item.startTime)
    setEndTime(item.endTime)
    setSlotDuration(item.slotDuration)
    setIsAvailable(item.isAvailable)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteAvailability = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/availability/${id}`, {
        headers: { dToken }
      })
      if (data.success) {
        toast.success(data.message)
        fetchAvailability()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (dToken) {
      if (!profileData) {
        getProfileData()
      } else {
        fetchAvailability()
      }
    }
  }, [dToken, profileData])

  return (
    <div className='m-5 w-full max-w-6xl'>
      <div className='flex justify-between items-center mb-3'>
        <p className='text-lg font-medium'>{editId ? 'Edit Availability' : 'Manage Availability'}</p>
        {editId && <button onClick={resetForm} className='text-primary underline text-sm'>Cancel Edit</button>}
      </div>
      
      <div className='bg-white p-8 border rounded w-full max-w-4xl shadow-sm mb-8'>
        <form onSubmit={addAvailability} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end'>
          <div>
            <p className='text-sm mb-1 text-gray-600'>Day</p>
            <select className='border rounded px-3 py-2 w-full outline-none focus:border-primary' value={day} onChange={e => setDay(e.target.value)}>
              {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <p className='text-sm mb-1 text-gray-600'>Start Time</p>
            <input type='time' className='border rounded px-3 py-2 w-full outline-none focus:border-primary' value={startTime} onChange={e => setStartTime(e.target.value)} required />
          </div>
          <div>
            <p className='text-sm mb-1 text-gray-600'>End Time</p>
            <input type='time' className='border rounded px-3 py-2 w-full outline-none focus:border-primary' value={endTime} onChange={e => setEndTime(e.target.value)} required />
          </div>
          <div>
            <p className='text-sm mb-1 text-gray-600'>Slot Duration (Minutes)</p>
            <input type='number' className='border rounded px-3 py-2 w-full outline-none focus:border-primary' value={slotDuration} onChange={e => setSlotDuration(e.target.value)} required min="15" step="15" />
          </div>
          <div className='flex items-center gap-2 h-[42px]'>
            <input type="checkbox" id="available" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} />
            <label htmlFor="available" className='text-sm text-gray-600 cursor-pointer'>Active Availability</label>
          </div>
          <button type='submit' className='bg-primary text-white px-8 py-2.5 rounded hover:bg-indigo-600 transition-all shadow-md'>
            {editId ? 'Update Schedule' : 'Add Schedule'}
          </button>
        </form>
      </div>

      <div className='bg-white border rounded w-full max-w-4xl shadow-sm'>
        <div className='grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] py-3 px-6 border-b font-medium text-gray-500 text-sm bg-gray-50'>
          <p>Day</p>
          <p>Time Range</p>
          <p>Slot Duration</p>
          <p className='text-center'>Status</p>
          <p className='text-center'>Actions</p>
        </div>
        {availability.length === 0 ? (
          <p className='p-10 text-center text-gray-500'>No availability schedules set yet.</p>
        ) : (
          availability.map((item, index) => (
            <div key={index} className='grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] py-4 px-6 border-b items-center hover:bg-gray-50 transition-colors text-sm'>
              <p className='font-medium text-gray-800'>{item.day}</p>
              <p className='text-gray-600'>{item.startTime} - {item.endTime}</p>
              <p className='text-gray-600'>{item.slotDuration} min</p>
              <div className='flex justify-center'>
                <span className={`px-2 py-1 rounded-full text-[10px] ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.isAvailable ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className='flex justify-center gap-3'>
                <img onClick={() => handleEdit(item)} className='w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity' src={assets.upload_area} alt="Edit" title='Edit' />
                <img onClick={() => deleteAvailability(item._id)} className='w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity' src={assets.cancel_icon} alt="Delete" title='Delete' />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ManageAvailability
