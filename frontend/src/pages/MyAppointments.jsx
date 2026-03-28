import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import ReviewForm from '../components/ReviewForm'

const MyAppointments = () => {

    const { backendUrl, token, slotDateFormat } = useContext(AppContext)

    const [appointments, setAppointments] = useState([])
    const [reviewModal, setReviewModal] = useState({ show: false, doctorId: null, appointmentId: null })
    const [payment, setPayment] = useState('')

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
            <div className=''>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] font-medium mt-1'>Address:</p>
                            <p className=''>{item.docData.address.line1}</p>
                            <p className=''>{item.docData.address.line2}</p>
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            <span className={`py-1 px-4 border rounded-full text-xs font-medium self-center sm:self-end sm:min-w-48 ${item.status === "Pending" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                                item.status === "Confirmed" ? "bg-green-50 text-green-600 border-green-200" :
                                    item.status === "Consultation In Progress" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                        item.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                            "bg-red-50 text-red-600 border-red-200"
                                }`}>
                                Appointment Status: {item.status}
                            </span>

                            {item.status !== "Cancelled" && !item.payment && item.status !== "Completed" && payment !== item._id && <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
                            {item.status !== "Cancelled" && !item.payment && item.status !== "Completed" && payment === item._id && <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" /></button>}
                            {item.status !== "Cancelled" && item.payment && item.status !== "Completed" && <button className='sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]'>Paid</button>}

                            {item.status === "Completed" && (
                                <div className='flex flex-col gap-2'>
                                    {!item.isReviewed ? (
                                        <button
                                            onClick={() => setReviewModal({ show: true, doctorId: item.docId, appointmentId: item._id })}
                                            className='sm:min-w-48 py-2 border border-primary rounded text-primary hover:bg-primary hover:text-white transition-all duration-300'
                                        >
                                            Leave Review
                                        </button>
                                    ) : (
                                        <button className='sm:min-w-48 py-2 border border-gray-400 rounded text-gray-400 cursor-default'>Reviewed</button>
                                    )}
                                </div>
                            )}

                            {(item.status === "Pending" || item.status === "Confirmed") && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                        </div>
                    </div>
                ))}
            </div>

            {reviewModal.show && (
                <ReviewForm
                    doctorId={reviewModal.doctorId}
                    appointmentId={reviewModal.appointmentId}
                    onReviewSubmit={getUserAppointments}
                    onClose={() => setReviewModal({ show: false, doctorId: null, appointmentId: null })}
                />
            )}
        </div>
    )
}

export default MyAppointments