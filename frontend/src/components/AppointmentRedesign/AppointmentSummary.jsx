import React from 'react'

const AppointmentSummary = ({ docInfo, selectedDate, selectedTime, currencySymbol }) => {
    if (!docInfo) return null;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm sticky top-10 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Appointment Summary
            </h3>
            
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <img src={docInfo.image} alt={docInfo.name} className="w-12 h-12 rounded-lg bg-primary/10 object-cover" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{docInfo.name}</p>
                        <p className="text-xs text-gray-500">{docInfo.speciality}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 dark:border-gray-700 py-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span> Date
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {selectedDate ? selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not selected'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span> Time
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {selectedTime || 'Not selected'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600 dark:text-gray-400">Consultation Fee</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{currencySymbol}{docInfo.fees}</span>
                </div>
            </div>
        </div>
    )
}

export default AppointmentSummary
