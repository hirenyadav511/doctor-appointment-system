import React from 'react'

const SlotGroup = ({ title, slots, selectedTime, onSelectSlot, icon }) => {
    if (slots.length === 0) return null;

    return (
        <div className="mb-6 animate-fade-in">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                {icon}
                {title}
            </h4>
            <div className="flex flex-wrap gap-3">
                {slots.map((item, index) => {
                    const isSelected = item.time === selectedTime;
                    const isBooked = !item.available;
                    const isFewLeft = item.availabilityStatus === 'few';

                    let statusClasses = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary";
                    if (isSelected) {
                        statusClasses = "bg-primary text-white border-primary shadow-md scale-105";
                    } else if (isBooked) {
                        statusClasses = "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-700 cursor-not-allowed opacity-60";
                    } else if (isFewLeft) {
                        statusClasses = "border-yellow-400 text-yellow-700 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20";
                    } else {
                        statusClasses = "border-green-400 text-green-700 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20";
                    }

                    return (
                        <button
                            key={index}
                            disabled={isBooked}
                            onClick={() => onSelectSlot(item.time)}
                            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${statusClasses}`}
                        >
                            {item.time}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SlotGroup
