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
    <div className='m-5 max-h-[90vh] overflow-y-scroll relative'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <div className='h-64 w-full overflow-hidden relative' onClick={() => setSelectedDoc(item)}>
              <img className='bg-[#EAEFFF] w-full h-full object-contain group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
              <div className='absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center transition-all duration-500'>
                <p className='text-white font-medium px-3 py-1 bg-primary rounded-full'>View Profile</p>
              </div>
            </div>
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>

              <div className='mt-3 flex items-center gap-1 text-sm'>
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoc && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative'>

            {/* Close Button */}
            <button
              onClick={() => setSelectedDoc(null)}
              className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10'
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className='flex flex-col md:flex-row'>
              {/* Image Section */}
              <div className='bg-primary/20 sm:w-1/3 flex items-center justify-center p-6'>
                <img className='w-full max-w-xs rounded-lg' src={selectedDoc.image} alt="" />
              </div>

              {/* Details Section */}
              <div className='p-8 sm:w-2/3 flex flex-col justify-center'>
                <h2 className='text-3xl font-semibold text-gray-800 mb-1'>{selectedDoc.name}</h2>
                <div className='flex items-center gap-2 mb-4'>
                  <p className='text-primary font-medium bg-primary/10 px-3 py-1 rounded-full text-sm'>
                    {selectedDoc.speciality}
                  </p>
                  <p className='text-gray-500 text-sm font-medium'>
                    {selectedDoc.degree}
                  </p>
                </div>

                <div className='space-y-4 text-gray-600'>
                  <div>
                    <h3 className='font-medium text-gray-800 mb-1'>About</h3>
                    <p className='text-sm leading-relaxed'>{selectedDoc.about}</p>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-500'>Experience</p>
                      <p className='font-medium text-gray-800'>{selectedDoc.experience}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Consultation Fee</p>
                      <p className='font-medium text-gray-800'>{currency} {selectedDoc.fees}</p>
                    </div>
                    <div className='col-span-2'>
                      <p className='text-sm text-gray-500'>Email Address</p>
                      <p className='font-medium text-gray-800'>{selectedDoc.email}</p>
                    </div>
                    <div className='col-span-2'>
                      <p className='text-sm text-gray-500'>Clinic Address</p>
                      <p className='font-medium text-gray-800'>{selectedDoc.address?.line1}</p>
                      {selectedDoc.address?.line2 && <p className='font-medium text-gray-800'>{selectedDoc.address?.line2}</p>}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default DoctorsList