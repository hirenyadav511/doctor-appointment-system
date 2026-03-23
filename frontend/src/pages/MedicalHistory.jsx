import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const MedicalHistory = () => {
  const { backendUrl, token, userData } = useContext(AppContext)
  const [history, setHistory] = useState([])

  const fetchMedicalHistory = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/medical-history/patient`, {
        headers: { token }
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

  useEffect(() => {
    if (token && userData) {
      fetchMedicalHistory()
    }
  }, [token, userData])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>MY MEDICAL HISTORY</p>
      
      {!history.length ? (
        <p className='mt-5 text-gray-500'>You have no medical records yet.</p>
      ) : (
        <div className='mt-5 flex flex-col gap-4'>
          {history.map((record, index) => (
            <div key={index} className='border rounded p-4 shadow-sm bg-gray-50 text-sm'>
              <div className='flex justify-between border-b pb-2 mb-2'>
                <p className='font-medium text-lg text-primary'>{record.doctorId?.name || 'Doctor'}</p>
                <div className='text-right'>
                  <p className='text-gray-500 font-medium'>{new Date(record.visitDate).toLocaleDateString()}</p>
                  <p className='text-gray-400 text-xs'>{record.appointmentId?.slotTime}</p>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='font-medium text-gray-700'>Diagnosis:</p>
                  <p className='text-gray-600 mt-1'>{record.diagnosis}</p>
                </div>
                <div>
                  <p className='font-medium text-gray-700'>Prescription:</p>
                  <p className='text-gray-600 mt-1 whitespace-pre-line'>{record.prescription}</p>
                </div>
                {record.notes && (
                  <div className='col-span-1 md:col-span-2 mt-2 pt-2 border-t'>
                    <p className='font-medium text-gray-700'>Notes:</p>
                    <p className='text-gray-600 mt-1'>{record.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MedicalHistory
