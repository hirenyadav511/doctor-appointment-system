import React from 'react'

const AppointmentSummary = ({ docInfo, selectedDate, selectedTime, currencySymbol }) => {
    if (!docInfo) return null;

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm sticky top-10">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5 border-b border-gray-50 pb-2">
                Appointment Summary
            </h3>
            
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <img src={docInfo.image} alt={docInfo.name} className="w-10 h-10 rounded bg-gray-50 object-cover" />
                    <div>
                        <p className="text-xs font-bold text-gray-800">{docInfo.name}</p>
                        <p className="text-[10px] text-gray-400">{docInfo.speciality}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Date</p>
                        <p className="text-xs font-semibold text-gray-700">
                            {selectedDate ? selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '---'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Time</p>
                        <p className="text-xs font-semibold text-gray-700">
                            {selectedTime || '---'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Consultation Fee</span>
                    <span className="text-lg font-bold text-gray-900">{currencySymbol}{docInfo.fees}</span>
                </div>
            </div>
        </div>
    )
}

export default AppointmentSummary
