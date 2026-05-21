import React from 'react'

const AppointmentSummary = ({ docInfo, selectedDate, selectedTime, currencySymbol }) => {
    if (!docInfo) return null;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-200/40 sticky top-10">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0FB9B1]"></span>
                Summary
            </h3>
            
            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <img src={docInfo.image} alt={docInfo.name} className="w-14 h-14 rounded-lg bg-white object-cover shadow-sm border border-gray-50" />
                    <div>
                        <p className="text-sm font-bold text-gray-800">{docInfo.name}</p>
                        <p className="text-[11px] font-medium text-[#0FB9B1] mt-0.5">{docInfo.speciality}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Date</p>
                        <p className="text-xs font-semibold text-gray-800">
                            {selectedDate ? selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '---'}
                        </p>
                    </div>
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Time</p>
                        <p className="text-xs font-semibold text-gray-800">
                            {selectedTime || '---'}
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-gray-500 font-medium">Consultation Fee</span>
                        <span className="text-lg font-black text-gray-800">{currencySymbol}{docInfo.fees}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 text-right italic">Taxes included</p>
                </div>
            </div>
        </div>
    )
}

export default AppointmentSummary
