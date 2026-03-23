import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import StarRating from './StarRating'

const ReviewForm = ({ doctorId, appointmentId, onReviewSubmit, onClose }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { backendUrl, token } = useContext(AppContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return toast.error('Login to leave a review')

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/reviews/add`,
        { doctorId, appointmentId, rating, comment },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        onReviewSubmit()
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Leave a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Rating</p>
            <StarRating rating={rating} setRating={setRating} interactive size="md" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Comment</p>
            <textarea
              className="w-full border dark:border-gray-700 rounded-lg p-3 outline-none focus:border-primary dark:bg-gray-700 dark:text-white resize-none"
              rows="4"
              placeholder="What did you like or dislike about your visit?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-all disabled:bg-gray-400 shadow-md"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewForm
