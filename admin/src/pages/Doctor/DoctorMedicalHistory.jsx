import React, { useState, useEffect, useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const DoctorMedicalHistory = () => {
  const { backendUrl, dToken } = useContext(DoctorContext)
  const { slotDateFormat } = useContext(AppContext)
  
  const [history, setHistory] = useState([])

  const fetchDoctorHistory = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/medical-history/doctor`, {
        headers: { dToken }
      })
      if (data.success) {
        setHistory(data.history)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const deleteRecord = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/medical-history/${id}`, {
        headers: { dToken }
      })
      
      if (data.success) {
        toast.success(data.message)
        fetchDoctorHistory()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    if (dToken) {
      fetchDoctorHistory()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>Medical History Records</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_2.5fr_2.5fr_1.5fr_1.5fr_0.5fr] gap-4 py-3 px-6 border-b text-gray-500 font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Diagnosis</p>
          <p>Prescription</p>
          <p>Visit Date</p>
          <p>Visit Time</p>
          <p>Action</p>
        </div>
        
        {history.length === 0 && <p className='p-6 text-center text-gray-500'>No medical history records found.</p>}

        {history.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_2.5fr_2.5fr_1.5fr_1.5fr_0.5fr] gap-4 items-center text-gray-600 py-4 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              {item.patientId?.image && <img src={item.patientId.image} className='w-8 rounded-full' alt="" />} 
              <p>{item.patientId?.name || 'Patient'}</p>
            </div>
            <p className='truncate' title={item.diagnosis}>{item.diagnosis}</p>
            <p className='truncate' title={item.prescription}>{item.prescription}</p>
            <p>{new Date(item.visitDate).toLocaleDateString()}</p>
            <p>{item.appointmentId?.slotTime || 'N/A'}</p>
            <div>
              <img onClick={() => deleteRecord(item._id)} className='w-8 cursor-pointer hover:bg-gray-200 rounded-full p-1' src={assets.cancel_icon} alt="Delete" title='Delete Record' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorMedicalHistory
