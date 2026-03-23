import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import StarRating from './StarRating'
import Skeleton from './Skeleton'

const DoctorReviews = ({ doctorId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const { backendUrl } = useContext(AppContext)

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/reviews/doctor/${doctorId}`)
      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (doctorId) {
      fetchReviews()
    }
  }, [doctorId])

  if (loading) {
    return (
      <div className="mt-10 space-y-4">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Patient Reviews ({reviews.length})</h3>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet for this doctor.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  className="w-10 h-10 rounded-full object-cover border dark:border-gray-600" 
                  src={review.patientId.image} 
                  alt="" 
                />
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{review.patientId.name}</p>
                  <StarRating rating={review.rating} size="xs" />
                </div>
                <span className="ml-auto text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorReviews
