import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import AdminAnalytics from '../../components/AdminAnalytics'
import AppointmentsChart from '../../components/AppointmentsChart'
import AppointmentStatusChart from '../../components/AppointmentStatusChart'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData, analyticsData, getAnalyticsData, updateAppointmentStatus } = useContext(AdminContext)
  const { slotDateFormat, currencySymbol } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
      getAnalyticsData()
    }
  }, [aToken])

  const statusColors = {
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Confirmed": "bg-green-100 text-green-800 border-green-200",
    "Consultation In Progress": "bg-blue-100 text-blue-800 border-blue-200",
    "Completed": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Cancelled": "bg-red-100 text-red-800 border-red-200"
  }

  return dashData && (
    <div className='m-5'>

      {analyticsData && (
        <AdminAnalytics analytics={analyticsData} currency={currencySymbol} />
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10'>
        {analyticsData && analyticsData.monthlyStats && (
          <AppointmentsChart data={analyticsData.monthlyStats} />
        )}
        {analyticsData && (
          <AppointmentStatusChart
            completed={analyticsData.completedAppointments}
            cancelled={analyticsData.cancelledAppointments}
          />
        )}
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
        <div className='flex items-center gap-2.5 px-6 py-5 rounded-t-xl border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'>
          <img src={assets.list_icon} className="dark:invert w-5" alt="" />
          <p className='font-semibold text-lg text-gray-800 dark:text-white'>Latest Bookings</p>
        </div>

        <div className='divide-y divide-gray-100 dark:divide-gray-700'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors' key={index}>
              <img className='rounded-full w-12 h-12 object-cover border dark:border-gray-600' src={item.docData.image} alt="" />
              <div className='flex-1'>
                <p className='text-gray-800 dark:text-white font-medium text-base'>{item.docData.name}</p>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              <div className='flex items-center gap-2'>
                <span className={`px-2 py-1 border rounded-full text-[10px] font-medium ${statusColors[item.status]}`}>
                  {item.status}
                </span>

                {item.status === "Pending" && (
                  <div className='flex gap-1'>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Confirmed')} className='text-[10px] bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-all'>Confirm</button>
                    <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[10px] bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all'>Cancel</button>
                  </div>
                )}

                {item.status === "Confirmed" && (
                  <button onClick={() => updateAppointmentStatus(item._id, 'Cancelled')} className='text-[10px] bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all'>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard