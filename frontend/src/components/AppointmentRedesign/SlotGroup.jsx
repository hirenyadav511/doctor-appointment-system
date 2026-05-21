import React from 'react'

const SlotGroup = ({ title, slots, selectedTime, onSelectSlot, icon }) => {
    if (slots.length === 0) return null;

    return (
        <div className="mb-6 animate-fade-in">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded flex items-center justify-center bg-gray-50">{icon}</span>
                {title}
            </h4>
            <div className="flex flex-wrap gap-2.5">
                {slots.map((item, index) => {
                    const isSelected = item.time === selectedTime;
                    const isBooked = !item.available;

                    let statusClasses = "border-gray-100 bg-white text-gray-700 hover:border-[#0FB9B1] hover:text-[#0FB9B1] hover:shadow-sm";
                    if (isSelected) {
                        statusClasses = "bg-gradient-to-r from-[#0FB9B1] to-[#0b9c95] text-white border-transparent font-bold shadow-md shadow-[#0FB9B1]/20 scale-105 transform";
                    } else if (isBooked) {
                        statusClasses = "bg-gray-50 text-gray-400 border-gray-50 cursor-not-allowed opacity-60";
                    }

                    return (
                        <button
                            key={index}
                            disabled={isBooked}
                            onClick={() => onSelectSlot(item.time)}
                            className={`px-4 py-2 rounded-lg border text-[13px] font-medium transition-all duration-300 ${statusClasses}`}
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
