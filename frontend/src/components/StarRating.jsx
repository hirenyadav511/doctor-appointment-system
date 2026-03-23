import React from 'react'

const StarRating = ({ rating, setRating, interactive = false, size = 'sm' }) => {
  const stars = [1, 2, 3, 4, 5]
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <svg
          key={star}
          onClick={() => interactive && setRating(star)}
          className={`${sizeClasses[size] || sizeClasses.sm} ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-200'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      {!interactive && rating > 0 && (
        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">({rating})</span>
      )}
    </div>
  )
}

export default StarRating
