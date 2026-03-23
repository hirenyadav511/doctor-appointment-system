import React, { useState, useContext } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorAddMedicalRecord = ({ appointmentId, patientId, onClose, onSuccess }) => {
  const { backendUrl, dToken } = useContext(DoctorContext)
  
  const [diagnosis, setDiagnosis] = useState('')
  const [prescription, setPrescription] = useState('')
  const [notes, setNotes] = useState('')
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        backendUrl + '/api/medical-history/add',
        { appointmentId, patientId, diagnosis, prescription, notes, visitDate },
        { headers: { dToken } }
      )
      
      if (data.success) {
        toast.success(data.message)
        onSuccess && onSuccess()
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded shadow-lg w-full max-w-md'>
        <h2 className='text-xl font-medium mb-4'>Add Medical Record</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm mb-1'>Visit Date</label>
            <input 
              type='date' 
              className='w-full border rounded px-3 py-2' 
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required 
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm mb-1'>Diagnosis</label>
            <input 
              type='text' 
              className='w-full border rounded px-3 py-2' 
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required 
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm mb-1'>Prescription</label>
            <textarea 
              className='w-full border rounded px-3 py-2 h-24' 
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              required 
            ></textarea>
          </div>
          <div className='mb-4'>
            <label className='block text-sm mb-1'>Notes (Optional)</label>
            <textarea 
              className='w-full border rounded px-3 py-2 h-20' 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
          <div className='flex justify-end gap-3'>
            <button type='button' onClick={onClose} className='px-4 py-2 border rounded text-gray-600 hover:bg-gray-100'>Cancel</button>
            <button type='submit' className='px-4 py-2 bg-primary text-white rounded'>Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DoctorAddMedicalRecord
