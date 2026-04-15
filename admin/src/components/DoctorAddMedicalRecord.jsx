import React, { useState, useContext } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorAddMedicalRecord = ({ appointmentId, patientId, onClose, onSuccess }) => {
  const { backendUrl, dToken } = useContext(DoctorContext)
  
  const [diagnosisSelections, setDiagnosisSelections] = useState([])
  const [diagnosisOther, setDiagnosisOther] = useState('')
  const [notesSelections, setNotesSelections] = useState([])
  const [notesOther, setNotesOther] = useState('')
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0])
  
  const [medicines, setMedicines] = useState([
    { name: '', dosage: 'Once Daily', duration: '', timing: { morning: false, afternoon: false, evening: false, night: false } }
  ])

  const diagnosisOptions = [
    'Viral Fever', 'Bacterial Infection', 'Migraine', 'Skin Allergy', 'Gastric Issue', 'Cold & Cough'
  ]

  const notesOptions = [
    'Take Rest', 'Drink Warm Water', 'Avoid Cold Drinks', 'Avoid Spicy Food', 'Regular Exercise', 'Follow-up after 3 days'
  ]

  const handleDiagnosisToggle = (option) => {
    setDiagnosisSelections(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    )
  }

  const handleNotesToggle = (option) => {
    setNotesSelections(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    )
  }

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines]
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      updatedMedicines[index][parent][child] = value
    } else {
      updatedMedicines[index][field] = value
    }
    setMedicines(updatedMedicines)
  }

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: 'Once Daily', duration: '', timing: { morning: false, afternoon: false, evening: false, night: false } }])
  }

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate medicines
    const validMedicines = medicines.filter(m => m.name.trim() !== '')
    if (validMedicines.length === 0) {
      return toast.error("Please add at least one medicine")
    }

    const finalDiagnosis = [...diagnosisSelections]
    if (diagnosisOther.trim()) finalDiagnosis.push(diagnosisOther.trim())

    const finalNotes = [...notesSelections]
    if (notesOther.trim()) finalNotes.push(notesOther.trim())

    const payload = {
      appointmentId,
      patientId,
      diagnosis: finalDiagnosis,
      prescription: validMedicines,
      notes: finalNotes,
      visitDate
    }

    try {
      const { data } = await axios.post(
        backendUrl + '/api/medical-history/add',
        payload,
        { headers: { token: dToken } }
      )
      
      if (data.success) {
        toast.success(data.message)
        onSuccess && onSuccess()
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      console.log(error)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto pt-10 pb-10'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-4xl m-4 overflow-hidden'>
        <div className='bg-primary p-4 text-white flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>New Medical Record</h2>
          <button onClick={onClose} className='text-white hover:bg-white/20 p-1 rounded-full text-xl w-8 h-8 flex items-center justify-center'>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 max-h-[85vh] overflow-y-auto custom-scrollbar'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            {/* Diagnosis Section */}
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <h3 className='font-bold text-gray-700 mb-3 border-b pb-2 flex items-center gap-2'>
                Diagnosis
              </h3>
              <div className='grid grid-cols-1 gap-2 mb-3'>
                {diagnosisOptions.map(option => (
                  <label key={option} className='flex items-center gap-3 p-2 bg-white rounded border border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors'>
                    <input 
                      type="checkbox" 
                      className='w-4 h-4 text-primary rounded focus:ring-primary'
                      checked={diagnosisSelections.includes(option)}
                      onChange={() => handleDiagnosisToggle(option)}
                    />
                    <span className='text-sm text-gray-700'>{option}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className='text-xs text-gray-500 block mb-1 font-medium'>Other Diagnosis</label>
                <input 
                  type="text" 
                  placeholder="Enter other diagnosis..."
                  className='w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none'
                  value={diagnosisOther}
                  onChange={(e) => setDiagnosisOther(e.target.value)}
                />
              </div>
            </div>

            {/* Notes Section */}
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <h3 className='font-bold text-gray-700 mb-3 border-b pb-2 flex items-center gap-2'>
                General Notes
              </h3>
              <div className='grid grid-cols-1 gap-2 mb-3'>
                {notesOptions.map(option => (
                  <label key={option} className='flex items-center gap-3 p-2 bg-white rounded border border-gray-100 hover:bg-green-50 cursor-pointer transition-colors'>
                    <input 
                      type="checkbox" 
                      className='w-4 h-4 text-green-600 rounded focus:ring-green-500'
                      checked={notesSelections.includes(option)}
                      onChange={() => handleNotesToggle(option)}
                    />
                    <span className='text-sm text-gray-700'>{option}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className='text-xs text-gray-500 block mb-1 font-medium'>Custom Notes</label>
                <textarea 
                  placeholder="Add custom notes..."
                  className='w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none h-16 resize-none'
                  value={notesOther}
                  onChange={(e) => setNotesOther(e.target.value)}
                ></textarea>
              </div>
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <label className='text-xs text-gray-500 block mb-1 font-medium'>Visit Date</label>
                <input 
                  type='date' 
                  className='w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none' 
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required 
                />
              </div>
            </div>

          </div>

          {/* Prescription Section */}
          <div className='mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200'>
            <div className='flex justify-between items-center mb-4 pb-2 border-b'>
              <h3 className='font-bold text-gray-700 flex items-center gap-2'>
                Prescription
              </h3>
              <button 
                type='button' 
                onClick={addMedicine}
                className='text-sm bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary-dark transition-all flex items-center gap-2'
              >
                + Add More Medicine
              </button>
            </div>

            <div className='space-y-6'>
              {medicines.map((med, index) => (
                <div key={index} className='bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group'>
                  {medicines.length > 1 && (
                    <button 
                      type='button' 
                      onClick={() => removeMedicine(index)}
                      className='absolute -top-2 -right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full hover:bg-red-200 flex items-center justify-center'
                    >
                      &times;
                    </button>
                  )}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='md:col-span-1'>
                      <label className='text-xs text-gray-500 block mb-1 font-medium uppercase'>Medicine Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Paracetamol"
                        className='w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none'
                        value={med.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        required={index === 0}
                      />
                    </div>
                    <div>
                      <label className='text-xs text-gray-500 block mb-1 font-medium uppercase'>Dosage</label>
                      <select 
                        className='w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white'
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      >
                        <option value="Once Daily">Once Daily</option>
                        <option value="Twice Daily">Twice Daily</option>
                        <option value="Thrice Daily">Thrice Daily</option>
                      </select>
                    </div>
                    <div>
                      <label className='text-xs text-gray-500 block mb-1 font-medium uppercase'>Duration (Days)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 5"
                        min="1"
                        className='w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none'
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        required={index === 0}
                      />
                    </div>
                  </div>

                  <div className='mt-4'>
                    <label className='text-xs text-gray-500 block mb-2 font-medium uppercase'>Timing</label>
                    <div className='flex flex-wrap gap-4'>
                      {['morning', 'afternoon', 'evening', 'night'].map(time => (
                        <label key={time} className='flex items-center gap-2 cursor-pointer group'>
                          <div className={`relative w-4 h-4 border rounded transition-all ${med.timing[time] ? 'bg-primary border-primary' : 'bg-gray-50 border-gray-300 group-hover:border-primary'}`}>
                            <input 
                              type="checkbox" 
                              className='absolute inset-0 opacity-0 cursor-pointer'
                              checked={med.timing[time]}
                              onChange={(e) => handleMedicineChange(index, `timing.${time}`, e.target.checked)}
                            />
                            {med.timing[time] && (
                              <div className='absolute inset-0 flex items-center justify-center text-white text-[10px]'>✓</div>
                            )}
                          </div>
                          <span className='text-sm text-gray-600 capitalize'>{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='flex justify-end gap-3 mt-8 pt-6 border-t'>
            <button type='button' onClick={onClose} className='px-8 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-all'>Cancel</button>
            <button type='submit' className='px-10 py-2.5 bg-primary text-white rounded-lg hover:shadow-lg hover:bg-primary-dark transition-all font-semibold'>Save Record</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DoctorAddMedicalRecord
