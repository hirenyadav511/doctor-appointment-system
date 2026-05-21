import React, { useState } from 'react';

const CalendarDatePicker = ({ selectedDate, onDateSelect, docSlots = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || new Date()));

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const changeMonth = (offset) => {
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(currentMonth.getMonth() + offset);
        setCurrentMonth(nextMonth);
    };

    const getSlotInfoForDate = (date) => {
        const daySlots = docSlots.find(
            (item) => item[0] && item[0].datetime.toDateString() === date.toDateString()
        );
        if (!daySlots) return null;

        const availableCount = daySlots.filter((s) => s.available).length;
        const totalCount = daySlots.length;
        return { availableCount, totalCount };
    };

    const renderHeader = () => {
        const monthName = currentMonth.toLocaleString('default', { month: 'long' });
        const year = currentMonth.getFullYear();

        return (
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">{monthName} {year}</h3>
                <div className="flex gap-2">
                    <button type="button" onClick={() => changeMonth(-1)} className="p-2 rounded-lg bg-gray-50 hover:bg-[#0FB9B1] hover:text-white transition-colors border border-gray-100 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button type="button" onClick={() => changeMonth(1)} className="p-2 rounded-lg bg-gray-50 hover:bg-[#0FB9B1] hover:text-white transition-colors border border-gray-100 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        );
    };

    const renderDaysOfWeek = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map(day => (
                    <div key={day} className="text-center text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">{day}</div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const cells = [];
        const today = new Date();
        today.setHours(0,0,0,0);

        for (let i = 0; i < startDay; i++) cells.push(<div key={`empty-${i}`} className="p-1"></div>);

        for (let d = 1; d <= numDays; d++) {
            const date = new Date(year, month, d);
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today;
            const slotInfo = getSlotInfoForDate(date);
            const hasSlots = slotInfo !== null;
            const isAvailable = hasSlots && slotInfo.availableCount > 0;
            const isFullyBooked = hasSlots && slotInfo.availableCount === 0;

            cells.push(
                <div key={d} className="p-1">
                    <button
                        type="button"
                        disabled={isPast || (!hasSlots && !isToday) || isFullyBooked}
                        onClick={() => hasSlots && !isFullyBooked && onDateSelect(date)}
                        className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-colors relative
                            ${isPast || (!hasSlots && !isToday) || isFullyBooked ? 'text-gray-300 cursor-not-allowed bg-gray-50/50' : 'hover:bg-gray-50 hover:text-[#0FB9B1]'}
                            ${isSelected ? 'bg-[#0FB9B1] text-white font-bold' : 'text-gray-700'}
                        `}
                    >
                        <span className="text-sm">{d}</span>
                        {hasSlots && !isSelected && !isFullyBooked && (
                            <span className="w-1 h-1 rounded-full bg-[#0FB9B1] absolute bottom-1.5"></span>
                        )}
                        {isToday && !isSelected && !hasSlots && (
                             <span className="text-[9px] mt-0.5 font-medium text-[#0FB9B1]">Today</span>
                        )}
                    </button>
                </div>
            );
        }
        return <div className="grid grid-cols-7 gap-1">{cells}</div>;
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCells()}
        </div>
    );
};

export default CalendarDatePicker;
