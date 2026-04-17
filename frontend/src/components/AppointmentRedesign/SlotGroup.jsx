import React from 'react'

const SlotGroup = ({ title, slots, selectedTime, onSelectSlot, icon }) => {
    if (slots.length === 0) return null;

    return (
        <div className="mb-6 animate-fade-in">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                {icon}
                {title}
            </h4>
            <div className="flex flex-wrap gap-2">
                {slots.map((item, index) => {
                    const isSelected = item.time === selectedTime;
                    const isBooked = !item.available;

                    let statusClasses = "border-gray-50 bg-white text-gray-600 hover:border-[#0FB9B1]/30 hover:bg-gray-50";
                    if (isSelected) {
                        statusClasses = "bg-[#0FB9B1] text-white border-[#0FB9B1] font-bold";
                    } else if (isBooked) {
                        statusClasses = "bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed opacity-40";
                    }

                    return (
                        <button
                            key={index}
                            disabled={isBooked}
                            onClick={() => onSelectSlot(item.time)}
                            className={`px-3 py-1.5 rounded-md border text-xs transition-all duration-200 ${statusClasses}`}
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
