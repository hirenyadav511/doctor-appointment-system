import React, { useState } from 'react'

const CalendarDatePicker = ({ selectedDate, onDateSelect, availableDates }) => {
    // Current viewed month in calendar
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
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{monthName} {year}</h3>
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => changeMonth(-1)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        type="button"
                        onClick={() => changeMonth(1)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    const renderDaysOfWeek = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase">{day}</div>
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

        // Padding for previous month
        for (let i = 0; i < startDay; i++) {
            cells.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        const today = new Date();
        today.setHours(0,0,0,0);

        for (let d = 1; d <= numDays; d++) {
            const date = new Date(year, month, d);
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === today.toDateString();
            
            const isPast = date < today;

            cells.push(
                <div key={d} className="p-1">
                    <button
                        type="button"
                        disabled={isPast}
                        onClick={() => onDateSelect(date)}
                        className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-300 relative
                            ${isPast ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:bg-[#0FB9B1]/10 hover:text-[#0FB9B1]'}
                            ${isSelected ? 'bg-[#0FB9B1] text-white hover:bg-[#0FB9B1] hover:text-white shadow-lg scale-105 z-10' : 'text-gray-700 dark:text-gray-300'}
                            ${isToday && !isSelected ? 'border border-[#0FB9B1]/50' : ''}
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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCells()}
        </div>
    );
};

export default CalendarDatePicker;
