import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import Skeleton from '../components/Skeleton'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600 dark:text-gray-300'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : 'text-gray-600 dark:text-white dark:border-gray-600'}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 dark:text-gray-300 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((spec) => (
            <p
              key={spec}
              onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-600 rounded transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${speciality === spec ? 'bg-blue-100 text-black dark:bg-gray-700 dark:text-white' : ''}`}
            >
              {spec}
            </p>
          ))}
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.length === 0 && doctors.length === 0
            ? Array(8).fill(0).map((_, index) => (
              <div key={index} className='p-4 border border-blue-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800'>
                <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
            : filterDoc.map((item, index) => (
              <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='group border border-blue-200 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800' key={index}>
                <div className="overflow-hidden relative">
                  <img className='bg-blue-50 dark:bg-gray-700 w-full object-cover group-hover:scale-110 transition-transform duration-500' src={item.image} alt="" />
                </div>
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                    <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                  </div>
                  <p className='text-gray-900 dark:text-white text-lg font-medium mt-1'>{item.name}</p>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors