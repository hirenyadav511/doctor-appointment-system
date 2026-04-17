import React, { useState } from 'react'

const CalendarDatePicker = ({ selectedDate, onDateSelect, availableDates }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || new Date()));

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const changeMonth = (offset) => {
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(currentMonth.getMonth() + offset);
        setCurrentMonth(nextMonth);
    };

    const renderHeader = () => {
        const monthName = currentMonth.toLocaleString('default', { month: 'long' });
        const year = currentMonth.getFullYear();

        return (
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">{monthName} {year}</h3>
                <div className="flex gap-1">
                    <button type="button" onClick={() => changeMonth(-1)} className="p-1.5 rounded bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button type="button" onClick={() => changeMonth(1)} className="p-1.5 rounded bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        );
    };

    const renderDaysOfWeek = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 mb-3">
                {days.map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{day}</div>
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

            cells.push(
                <div key={d} className="p-0.5">
                    <button
                        type="button"
                        disabled={isPast}
                        onClick={() => onDateSelect(date)}
                        className={`w-full aspect-square flex items-center justify-center rounded-md text-xs transition-all
                            ${isPast ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-gray-50 hover:text-[#0FB9B1]'}
                            ${isSelected ? 'bg-[#0FB9B1] text-white hover:bg-[#0FB9B1] hover:text-white font-bold' : 'text-gray-600'}
                            ${isToday && !isSelected ? 'underline underline-offset-4 decoration-[#0FB9B1]' : ''}
                        `}
                    >
                        {d}
                    </button>
                </div>
            );
        }
        return <div className="grid grid-cols-7">{cells}</div>;
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCells()}
        </div>
    );
};

export default CalendarDatePicker;
