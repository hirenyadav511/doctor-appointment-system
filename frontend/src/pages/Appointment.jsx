import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import Skeleton from '../components/Skeleton'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [step, setStep] = useState(1) // 1: Select Slot, 2: Review & Book

    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {
        setDocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    return docInfo ? (
        <div>
            {/* Step Indicator */}
            <div className="flex items-center justify-center my-8">
                <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>1</div>
                    <span className="ml-2 font-medium">Select Slot</span>
                </div>
                <div className="w-16 h-1 bg-gray-300 mx-4">
                    <div className={`h-full bg-primary transition-all duration-300 ${step === 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>2</div>
                    <span className="ml-2 font-medium">Review & Book</span>
                </div>
            </div>

            {/* Content Info */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='w-full sm:max-w-72'>
                    <img className='bg-primary w-full rounded-lg object-cover' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-8 py-7 bg-white dark:bg-gray-800 mx-2 sm:mx-0 mt-[-80px] sm:mt-0 shadow-sm'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700 dark:text-gray-200'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border dark:border-gray-600 text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    <div className='mt-3'>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-800 dark:text-gray-200'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 dark:text-gray-400 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-600 dark:text-gray-400 font-medium mt-4'>Appointment fee: <span className='text-gray-800 dark:text-gray-200 font-bold'>{currencySymbol}{docInfo.fees}</span> </p>
                </div>
            </div>

            {/* Booking Flow */}
            <div className='mt-8 font-medium text-gray-700 dark:text-gray-300'>

                {step === 1 && (
                    <div className="animate-fade-in">
                        <p className="text-xl mb-4">Select a Time Slot</p>
                        <div className='flex gap-3 items-center w-full overflow-x-scroll pb-4 scrollbar-hide'>
                            {docSlots.length && docSlots.map((item, index) => (
                                <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-xl cursor-pointer transition-all ${slotIndex === index ? 'bg-primary text-white shadow-lg scale-105' : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary'}`}>
                                    <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                    <p className="text-xl font-bold">{item[0] && item[0].datetime.getDate()}</p>
                                </div>
                            ))}
                        </div>

                        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 w-full mt-4'>
                            {docSlots.length && docSlots[slotIndex].map((item, index) => (
                                <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-light flex items-center justify-center px-2 py-2 rounded-full cursor-pointer transition-colors ${item.time === slotTime ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary'}`}>{item.time.toLowerCase()}</p>
                            ))}
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => slotTime ? setStep(2) : toast.info('Please select a time slot')}
                                className={`px-8 py-3 rounded-full text-white font-medium transition-all ${slotTime ? 'bg-primary hover:bg-indigo-600 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
                            >
                                Continue to Review
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xl mb-6 border-b pb-2 dark:border-gray-600">Review Appointment Details</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Doctor</p>
                                <p className="text-lg font-medium">{docInfo.name}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{docInfo.speciality}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Date & Time</p>
                                <p className="text-lg font-medium">
                                    {docSlots[slotIndex][0] && daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]}, {docSlots[slotIndex][0] && docSlots[slotIndex][0].datetime.getDate()} <br />
                                    <span className="text-primary">{slotTime}</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Consultation Fee</p>
                                <p className="text-lg font-medium">{currencySymbol}{docInfo.fees}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-8 pt-4 border-t dark:border-gray-600">
                            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 underline">Back</button>
                            <button onClick={bookAppointment} className='bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-10 py-3 rounded-full shadow-lg transition-all transform hover:scale-105'>Confirm & Book Appointment</button>
                        </div>
                    </div>
                )}
            </div>

            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : (
        <div className='flex flex-col gap-4 p-4'>
            <Skeleton className="h-64 rounded-lg w-full md:w-1/3" />
            <Skeleton className="h-32 rounded-lg w-full" />
            <Skeleton className="h-20 rounded-lg w-full" />
        </div>
    )
}

export default Appointment