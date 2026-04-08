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
        <div className='max-sm:hidden grid grid-cols-[0.5fr_1.5fr_2fr_3fr_1.2fr_1.2fr_0.6fr] gap-4 py-3 px-6 border-b text-gray-500 font-medium bg-gray-50'>
          <p>#</p>
          <p>Patient</p>
          <p>Diagnosis</p>
          <p>Prescription</p>
          <p>Notes</p>
          <p>DateTime</p>
          <p>Action</p>
        </div>
        
        {history.length === 0 && <p className='p-6 text-center text-gray-500'>No medical history records found.</p>}

        {history.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_1.5fr_2fr_3fr_1.2fr_1.2fr_0.6fr] gap-4 items-start text-gray-600 py-6 px-6 border-b hover:bg-gray-50 transition-colors' key={index}>
            <p className='max-sm:hidden pt-1'>{index + 1}</p>
            <div className='flex items-center gap-2 pt-1'>
              <img src={item.patientId?.image || assets.profile_img} className='w-8 h-8 rounded-full object-cover border' alt="" /> 
              <p className='font-medium text-gray-900'>{item.patientId?.name || 'Patient'}</p>
            </div>
            
            {/* Diagnosis Display */}
            <div className='flex flex-wrap gap-1'>
              {Array.isArray(item.diagnosis) ? (
                item.diagnosis.map((d, i) => (
                  <span key={i} className='bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100'>{d}</span>
                ))
              ) : (
                <p className='text-xs'>{item.diagnosis}</p>
              )}
            </div>

            {/* Prescription Display */}
            <div className='space-y-2'>
              {Array.isArray(item.prescription) ? (
                item.prescription.map((m, i) => (
                  <div key={i} className='bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 flex flex-col gap-1'>
                    <p className='font-bold text-gray-800 text-xs'>{m.name}</p>
                    <div className='flex justify-between items-center'>
                      <span className='text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded border leading-none'>{m.dosage}</span>
                      <span className='text-[10px] text-gray-400 font-medium'>{m.duration} days</span>
                    </div>
                    {m.timing && (
                      <div className='flex gap-1 mt-1'>
                        {Object.entries(m.timing).filter(([_, val]) => val).map(([key]) => (
                          <span key={key} className='text-[8px] uppercase bg-emerald-500 text-white px-1 rounded leading-none py-0.5'>{key}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className='text-xs whitespace-pre-line'>{item.prescription}</p>
              )}
            </div>

            {/* Notes Display */}
            <div className='flex flex-wrap gap-1'>
              {Array.isArray(item.notes) ? (
                item.notes.map((n, i) => (
                  <span key={i} className='bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] italic border border-orange-100'>{n}</span>
                ))
              ) : (
                <p className='text-[11px] italic'>{item.notes}</p>
              )}
            </div>

            <div className='pt-1'>
              <p className='font-medium text-gray-700'>{new Date(item.visitDate).toLocaleDateString()}</p>
              <p className='text-[10px] text-gray-400'>{item.appointmentId?.slotTime || 'N/A'}</p>
            </div>

            <div className='pt-1 flex justify-center'>
              <button 
                onClick={() => deleteRecord(item._id)} 
                className='w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-all'
                title='Delete Record'
              >
                <img className='w-5' src={assets.cancel_icon} alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorMedicalHistory
