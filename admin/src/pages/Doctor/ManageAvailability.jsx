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
    <div className='m-5 w-full max-w-6xl animate-slide-up'>
      <div className='flex justify-between items-center mb-6'>
        <p className='text-2xl font-extrabold text-gray-800'>{editId ? 'Edit Schedule' : 'Manage Availability'}</p>
        {editId && <button onClick={resetForm} className='text-primary hover:text-primary/70 font-bold transition-all'>Cancel Edit</button>}
      </div>
      
      <div className='bg-white p-10 border-2 border-slate-50 rounded-3xl shadow-sm mb-10'>
        <form onSubmit={addAvailability} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-end'>
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-bold uppercase tracking-widest text-gray-400'>Day of Week</p>
            <select className='border-2 border-slate-100 rounded-xl px-4 py-3 w-full outline-none focus:border-primary transition-all font-medium text-gray-700 bg-slate-50/30' value={day} onChange={e => setDay(e.target.value)}>
              {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-bold uppercase tracking-widest text-gray-400'>Start Time</p>
            <input type='time' className='border-2 border-slate-100 rounded-xl px-4 py-3 w-full outline-none focus:border-primary transition-all font-medium text-gray-700 bg-slate-50/30' value={startTime} onChange={e => setStartTime(e.target.value)} required />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-bold uppercase tracking-widest text-gray-400'>End Time</p>
            <input type='time' className='border-2 border-slate-100 rounded-xl px-4 py-3 w-full outline-none focus:border-primary transition-all font-medium text-gray-700 bg-slate-50/30' value={endTime} onChange={e => setEndTime(e.target.value)} required />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-bold uppercase tracking-widest text-gray-400'>Slot Duration (Mins)</p>
            <input type='number' className='border-2 border-slate-100 rounded-xl px-4 py-3 w-full outline-none focus:border-primary transition-all font-medium text-gray-700 bg-slate-50/30' value={slotDuration} onChange={e => setSlotDuration(e.target.value)} required min="15" step="15" />
          </div>
          <div className='flex items-center gap-3 h-[52px]'>
            <input type="checkbox" id="available" className='w-5 h-5 accent-primary cursor-pointer' checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} />
            <label htmlFor="available" className='text-sm font-bold text-gray-500 cursor-pointer uppercase tracking-tight'>Active</label>
          </div>
          <button type='submit' className='bg-primary text-white px-8 py-3.5 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20'>
            {editId ? 'Update Schedule' : 'Save Schedule'}
          </button>
        </form>
      </div>

      <div className='bg-white border-2 border-slate-50 rounded-3xl shadow-sm overflow-hidden'>
        <div className='grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] py-5 px-8 border-b-2 border-slate-50 font-extrabold text-gray-400 text-xs uppercase tracking-widest bg-slate-50/30'>
          <p>Day</p>
          <p>Time Range</p>
          <p>Duration</p>
          <p className='text-center'>Status</p>
          <p className='text-center'>Manage</p>
        </div>
        <div className='max-h-[500px] overflow-y-auto'>
          {availability.length === 0 ? (
            <p className='p-16 text-center text-gray-400 font-medium'>No schedules configured yet.</p>
          ) : (
            availability.map((item, index) => (
              <div key={index} className='grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] py-6 px-8 border-b border-slate-50 items-center hover:bg-gray-50 transition-colors'>
                <p className='font-bold text-gray-800'>{item.day}</p>
                <p className='text-gray-500 font-medium bg-[#f0f9fa] px-3 py-1 rounded-lg inline-block w-fit'>{item.startTime} - {item.endTime}</p>
                <p className='text-gray-500 font-bold ml-2'>{item.slotDuration} <span className='text-[10px] text-gray-300'>min</span></p>
                <div className='flex justify-center'>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.isAvailable ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {item.isAvailable ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className='flex justify-center gap-4'>
                  <button onClick={() => handleEdit(item)} className='p-2 hover:bg-slate-100 rounded-full transition-all group' title='Edit'>
                    <img className='w-5 h-5 opacity-40 group-hover:opacity-100' src={assets.upload_area} alt="Edit" />
                  </button>
                   <button onClick={() => deleteAvailability(item._id)} className='p-2 hover:bg-red-50 rounded-full transition-all group' title='Delete'>
                    <img className='w-5 h-5 opacity-40 group-hover:opacity-100 filter brightness-50' src={assets.cancel_icon} alt="Delete" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageAvailability
