import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import './MyAppointments.css'

const MedicalHistory = () => {
  const { backendUrl, token, userData } = useContext(AppContext)
  const [history, setHistory] = useState([])
  const [expandedId, setExpandedId] = useState(null)

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

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div className="appointments-wrapper">
      <div className="appointments-container">
        <p className="appointments-title">My Medical History</p>
        
        {!history.length ? (
          <p className='mt-5 text-gray-500'>You have no medical records yet.</p>
        ) : (
          <div className="animate-slide-up">
            {history.map((record, index) => {
              const diagnosisText = Array.isArray(record.diagnosis) ? record.diagnosis.join(', ') : record.diagnosis;
              const prescriptionText = Array.isArray(record.prescription) ? record.prescription.map(p => p.name).join(', ') : record.prescription;
              const isExpanded = expandedId === record._id;

              return (
                <div key={index} className="appointment-item" style={{ display: 'block' }}>
                  
                  {/* Top Row: Matches existing UI */}
                  <div className="flex flex-col md:flex-row gap-[25px] items-center md:items-start text-center md:text-left w-full">
                    <div>
                      <img
                        className="doc-img-thumb"
                        src={record.doctorId?.image || 'https://via.placeholder.com/150'}
                        alt=""
                      />
                    </div>
                    <div className="appointment-details flex-1">
                      <p className="doc-name">{record.doctorId?.name || 'Doctor'}</p>
                      <p className="doc-spec">{record.doctorId?.speciality || 'General'}</p>
                      <div className="app-meta mt-2">
                        <p>
                          <strong>Diagnosis:</strong> {diagnosisText || 'N/A'}
                        </p>
                        <p>
                          <strong>Prescription:</strong> {prescriptionText || 'None'}
                        </p>
                        <p>
                          <strong>Date & Time:</strong>{" "}
                          {new Date(record.visitDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} | {record.appointmentId?.slotTime}
                        </p>
                      </div>
                    </div>

                    <div className="appointment-actions justify-center">
                      <span className="status-badge status-completed">
                        Completed
                      </span>
                      <button 
                        onClick={() => toggleExpand(record._id)} 
                        className="app-btn btn-pay mt-2 w-full text-center"
                      >
                        {isExpanded ? 'Hide Details' : 'View'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed View */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? 'max-h-[1000px] opacity-100 mt-5 pt-5 border-t border-gray-100' : 'max-h-0 opacity-0 mt-0 pt-0 border-transparent'
                    }`}
                  >
                    <div className="bg-gray-50 rounded-lg p-5 text-sm text-gray-700 space-y-4">
                      
                      <div>
                        <p className="font-bold text-gray-900 mb-1 text-base">Diagnosis / Symptoms</p>
                        <p>{diagnosisText || 'No diagnosis recorded'}</p>
                      </div>
                      
                      <div>
                        <p className="font-bold text-gray-900 mb-2 text-base">Prescription</p>
                        {Array.isArray(record.prescription) && record.prescription.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-2">
                            {record.prescription.map((m, i) => (
                              <li key={i}>
                                <span className="font-semibold text-gray-800">{m.name}</span> - {m.dosage} for {m.duration} Days
                                {m.timing && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {Object.entries(m.timing).filter(([_, v]) => v).map(([k]) => (
                                      <span key={k} className="text-[10px] uppercase font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
                                        {k}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>{record.prescription || 'No prescription recorded'}</p>
                        )}
                      </div>

                      {record.notes && (
                        <div>
                          <p className="font-bold text-gray-900 mb-1 text-base">Doctor's Notes / Reports</p>
                          <p className="italic text-gray-600 bg-white p-3 rounded border border-gray-200">
                            "{Array.isArray(record.notes) ? record.notes.join(', ') : record.notes}"
                          </p>
                        </div>
                      )}
                      
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicalHistory
