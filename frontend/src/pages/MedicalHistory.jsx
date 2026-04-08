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
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <p className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
                    <span className='w-1.5 h-1.5 rounded-full bg-blue-500'></span>
                    Diagnosis
                  </p>
                  <div className='flex flex-wrap gap-1.5'>
                    {Array.isArray(record.diagnosis) ? (
                      record.diagnosis.map((d, i) => (
                        <span key={i} className='bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-100'>{d}</span>
                      ))
                    ) : (
                      <p className='text-gray-600 pl-3'>{record.diagnosis}</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                    Prescription
                  </p>
                  <div className='space-y-3'>
                    {Array.isArray(record.prescription) ? (
                      record.prescription.map((m, i) => (
                        <div key={i} className='bg-white p-3 rounded-lg border border-emerald-100 shadow-sm'>
                          <div className='flex justify-between items-start mb-1'>
                            <p className='font-bold text-gray-900'>{m.name}</p>
                            <span className='text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase'>{m.duration} Days</span>
                          </div>
                          <p className='text-xs text-gray-500 mb-2'>{m.dosage}</p>
                          {m.timing && (
                            <div className='flex gap-2 mt-2'>
                              {Object.entries(m.timing).filter(([_, val]) => val).map(([key]) => (
                                <span key={key} className='text-[9px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded'>{key}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className='text-gray-600 mt-1 whitespace-pre-line pl-3'>{record.prescription}</p>
                    )}
                  </div>
                </div>

                {(record.notes && (Array.isArray(record.notes) ? record.notes.length > 0 : true)) && (
                  <div className='col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gray-200'>
                    <p className='font-bold text-gray-800 mb-2 flex items-center gap-2'>
                      <span className='w-1.5 h-1.5 rounded-full bg-orange-400'></span>
                      Doctor's Notes
                    </p>
                    <div className='flex flex-wrap gap-2 pl-3'>
                      {Array.isArray(record.notes) ? (
                        record.notes.map((n, i) => (
                          <span key={i} className='bg-orange-50 text-orange-700 px-3 py-1 rounded text-xs italic border border-orange-100'>&ldquo;{n}&rdquo;</span>
                        ))
                      ) : (
                        <p className='text-gray-600 italic'>&ldquo;{record.notes}&rdquo;</p>
                      )}
                    </div>
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
