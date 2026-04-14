import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const DoctorsList = () => {

  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext)
  const { currency } = useContext(AppContext)

  const [selectedDoc, setSelectedDoc] = useState(null)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-bold text-gray-800'>All Doctors</h1>
      
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div 
            className='bg-white border border-slate-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group hover:border-primary transition-all duration-300' 
            key={index}
            onClick={() => setSelectedDoc(item)}
          >
            <img 
              className='bg-blue-50 group-hover:bg-primary transition-all duration-500 w-full h-48 object-cover' 
              src={item.image} 
              alt="" 
            />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-center mb-1'>
                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-300'}`}></p>
                <p className={item.available ? 'text-green-500' : 'text-gray-400'}>Available</p>
                
                <input 
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => changeAvailability(item._id)} 
                  className='accent-primary w-4 h-4 cursor-pointer ml-auto' 
                  type="checkbox" 
                  checked={item.available} 
                />
              </div>
              <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
              <p className='text-zinc-600 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Details Modal - simplified */}
      {selectedDoc && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative p-8'>
            <button
              onClick={() => setSelectedDoc(null)}
              className='absolute top-4 right-4 text-gray-400 hover:text-primary transition-all'
            >
              ✕
            </button>

            <div className='flex items-center gap-5'>
              <img className='w-24 h-24 bg-primary rounded-full object-cover border-4 border-slate-50' src={selectedDoc.image} alt="" />
              <div>
                <h2 className='text-2xl font-bold text-gray-800'>{selectedDoc.name}</h2>
                <p className='text-gray-500 font-medium'>{selectedDoc.degree} - {selectedDoc.speciality}</p>
                <div className='flex gap-2 mt-2'>
                  <span className='bg-blue-50 text-primary text-[10px] font-bold px-2 py-1 rounded'>{selectedDoc.experience} Exp</span>
                  <span className='bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded'>{currency}{selectedDoc.fees}</span>
                </div>
              </div>
            </div>

            <div className='mt-8'>
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2'>Contact Information</p>
                <div className='bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-3 font-medium'>
                    <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-400'>Email</span>
                        <span className='text-gray-800'>{selectedDoc.email}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='text-gray-400'>Address</span>
                        <span className='text-gray-800 text-right max-w-[200px]'>
                          {selectedDoc.address.line1}, {selectedDoc.address.line2}
                        </span>
                    </div>
                </div>
            </div>

            <div className='mt-6'>
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2'>About Doctor</p>
                <p className='text-sm text-gray-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-5'>
                  {selectedDoc.about}
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorsList