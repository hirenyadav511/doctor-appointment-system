import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }
            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className='p-8 animate-fade-in'>
            <div className='max-w-4xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                <div className='flex flex-col md:flex-row'>
                    
                    {/* Simplified Sidebar/Image container */}
                    <div className='bg-[#f0f9fa] md:w-80 flex flex-col items-center p-10 border-r border-gray-50'>
                        <img 
                            className='w-48 h-48 rounded-2xl object-cover shadow-xl border-4 border-white mb-6' 
                            src={profileData.image} 
                            alt={profileData.name} 
                        />
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${profileData.available ? 'bg-[#0FB9B1]/10 text-[#0FB9B1]' : 'bg-gray-100 text-gray-400'}`}>
                            {profileData.available ? 'Active Status' : 'Inactive'}
                        </div>
                    </div>

                    {/* Main Details Area */}
                    <div className='flex-1 p-10'>
                        <div className='flex justify-between items-start mb-8'>
                            <div>
                                <h2 className='text-3xl font-black text-gray-900'>{profileData.name}</h2>
                                <p className='text-[#0FB9B1] font-bold text-sm mt-1'>{profileData.degree} — {profileData.speciality}</p>
                                <span className='inline-block mt-3 px-3 py-1 bg-gray-50 text-gray-400 text-xs font-bold rounded-lg border border-gray-100'>
                                    {profileData.experience} Level
                                </span>
                            </div>
                        </div>

                        <div className='space-y-8'>
                            {/* About Section - Simple */}
                            <div className='border-t border-gray-50 pt-8'>
                                <h3 className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4'>Doctor biography</h3>
                                {isEdit ? (
                                    <textarea 
                                        className='w-full p-4 border rounded-xl text-sm focus:border-[#0FB9B1] outline-none transition-all'
                                        rows={4}
                                        value={profileData.about}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                                    />
                                ) : (
                                    <p className='text-gray-600 text-sm leading-relaxed'>{profileData.about}</p>
                                )}
                            </div>

                            {/* Info Rows - Simplified */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                                <div>
                                    <h3 className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2'>Appointment Fee</h3>
                                    <div className='flex items-baseline gap-1'>
                                        <span className='text-gray-400 font-bold'>{currency}</span>
                                        {isEdit ? (
                                            <input 
                                                className='border-b-2 border-gray-200 focus:border-[#0FB9B1] outline-none text-xl font-black w-24 px-1' 
                                                type='number' 
                                                value={profileData.fees}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                            />
                                        ) : (
                                            <p className='text-2xl font-black text-gray-900'>{profileData.fees}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2'>Clinic Location</h3>
                                    {isEdit ? (
                                        <div className='space-y-2'>
                                            <input className='w-full p-2 border rounded text-xs' value={profileData.address.line1} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                                            <input className='w-full p-2 border rounded text-xs' value={profileData.address.line2} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
                                        </div>
                                    ) : (
                                        <div className='text-sm text-gray-700 font-bold'>
                                            <p>{profileData.address.line1}</p>
                                            <p className='text-gray-400 font-medium'>{profileData.address.line2}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Booking Status Toggle */}
                            <div className='flex items-center gap-3 pt-6 border-t border-gray-50'>
                                <input 
                                    id="availability"
                                    type="checkbox" 
                                    className='w-5 h-5 accent-[#0FB9B1] cursor-pointer'
                                    checked={profileData.available}
                                    onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                                />
                                <label htmlFor="availability" className={`text-xs font-black uppercase tracking-widest ${profileData.available ? 'text-[#0FB9B1]' : 'text-gray-300'}`}>
                                    Available for Patient Bookings
                                </label>
                            </div>

                            {/* Action Button */}
                            <div className='pt-6'>
                                {isEdit ? (
                                    <div className='flex gap-4'>
                                        <button 
                                            onClick={updateProfile} 
                                            className='bg-[#0FB9B1] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-110 shadow-lg shadow-[#0FB9B1]/20'
                                        >
                                            Save Changes
                                        </button>
                                        <button 
                                            onClick={() => setIsEdit(false)} 
                                            className='text-gray-400 font-bold text-xs uppercase'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsEdit(true)} 
                                        className='bg-[#0FB9B1] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#0FB9B1]/20'
                                    >
                                        Edit Profile Details ➔
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile