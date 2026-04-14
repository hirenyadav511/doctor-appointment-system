import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import Skeleton from "../components/Skeleton";
import StarRating from "../components/StarRating";
import DoctorReviews from "../components/DoctorReviews";
import axios from "axios";
import { toast } from "react-toastify";
import CalendarDatePicker from "../components/AppointmentRedesign/CalendarDatePicker";
import SlotGroup from "../components/AppointmentRedesign/SlotGroup";
import AppointmentSummary from "../components/AppointmentRedesign/AppointmentSummary";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [availability, setAvailability] = useState([]);
  const [step, setStep] = useState(1); // 1: Select Slot, 2: Review & Book

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const fetchAvailability = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/availability/${docId}`,
      );
      if (data.success) {
        setAvailability(data.availability);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAvailableSolts = async () => {
    // getting current date
    let today = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayName = dayNames[currentDate.getDay()];
      const dayAvailability = availability.filter(
        (avail) => avail.day === dayName && avail.isAvailable,
      );

      let timeSlots = [];

      if (dayAvailability.length > 0) {
        dayAvailability.forEach((avail) => {
          const [startHour, startMin] = avail.startTime.split(":").map(Number);
          const [endHour, endMin] = avail.endTime.split(":").map(Number);

          let slotStart = new Date(currentDate);
          slotStart.setHours(startHour, startMin, 0, 0);

          let slotEnd = new Date(currentDate);
          slotEnd.setHours(endHour, endMin, 0, 0);

          // If it is today, Ensure we don't show past slots
          if (today.toDateString() === currentDate.toDateString()) {
            const now = new Date();
            if (slotStart < now) {
              slotStart = new Date(now);
              slotStart.setMinutes(slotStart.getMinutes() + 1);
              // Align to slotDuration
              const remains = slotStart.getMinutes() % avail.slotDuration;
              if (remains !== 0) {
                slotStart.setMinutes(
                  slotStart.getMinutes() + (avail.slotDuration - remains),
                );
              }
              slotStart.setSeconds(0, 0);
            }
          }

          while (slotStart < slotEnd) {
            let formattedTime = slotStart.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            let day = slotStart.getDate();
            let month = slotStart.getMonth() + 1;
            let year = slotStart.getFullYear();

            const slotDate = day + "_" + month + "_" + year;
            const slotTime = formattedTime;

            const isBooked =
              docInfo.slots_booked[slotDate] &&
              docInfo.slots_booked[slotDate].includes(slotTime);

            timeSlots.push({
              datetime: new Date(slotStart),
              time: formattedTime,
              available: !isBooked,
              availabilityStatus: isBooked
                ? "booked"
                : Math.random() > 0.8
                  ? "few"
                  : "available",
            });

            slotStart.setMinutes(slotStart.getMinutes() + avail.slotDuration);
          }
        });
      }
      allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);

    // Auto-select first available slot
    if (allSlots.length > 0) {
      let found = false;
      for (let i = 0; i < allSlots.length; i++) {
        const firstAvailable = allSlots[i].find((s) => s.available);
        if (firstAvailable) {
          setSlotIndex(i);
          setSlotTime(firstAvailable.time);
          found = true;
          break;
        }
      }
    }
  };

  const groupSlotsByPeriod = (slots) => {
    const groups = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    if (!slots) return groups;

    slots.forEach((slot) => {
      const hour = slot.datetime.getHours();
      if (hour >= 6 && hour < 12) {
        groups.morning.push(slot);
      } else if (hour >= 12 && hour < 17) {
        groups.afternoon.push(slot);
      } else if (hour >= 17 && hour < 22) {
        groups.evening.push(slot);
      }
    });

    return groups;
  };

  const findNextAvailable = () => {
    for (let i = slotIndex + 1; i < docSlots.length; i++) {
      const firstAvailable = docSlots[i].find((s) => s.available);
      if (firstAvailable) {
        const date = docSlots[i][0].datetime;
        const dayName =
          i === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", { weekday: "long" });
        return `${dayName} at ${firstAvailable.time}`;
      }
    }
    return null;
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    const date = docSlots[slotIndex][0].datetime;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const slotDate = day + "_" + month + "_" + year;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
      fetchAvailability();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
    }
  }, [docInfo, availability]);

  return docInfo ? (
    <div className="animate-fade-in max-w-6xl mx-auto px-4">
      {/* Step Indicator - Compact and Teal */}
      <div className="flex items-center justify-center my-6 hidden sm:flex">
        <div
          className={`flex items-center ${step >= 1 ? "text-[#0FB9B1]" : "text-gray-400"}`}
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${step >= 1 ? "bg-[#0FB9B1] text-white" : "bg-gray-200 text-gray-400"}`}
          >
            1
          </div>
          <span className="ml-3 font-bold text-sm uppercase tracking-wider">Select Slot</span>
        </div>
        <div className="w-20 h-0.5 bg-gray-100 mx-6 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#0FB9B1] transition-all duration-500"
            style={{ width: step === 2 ? '100%' : '0%' }}
          ></div>
        </div>
        <div
          className={`flex items-center ${step >= 2 ? "text-[#0FB9B1]" : "text-gray-400"}`}
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${step >= 2 ? "bg-[#0FB9B1] text-white" : "bg-gray-200 text-gray-400"}`}
          >
            2
          </div>
          <span className="ml-3 font-bold text-sm uppercase tracking-wider">Review & Book</span>
        </div>
      </div>

      {/* Doctor Info Card */}
      {step === 1 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-10 items-start">
            <div className="w-full sm:w-64 flex-shrink-0">
                <img
                    className="bg-[#f0f9fa] w-full rounded-2xl shadow-md border-2 border-white object-cover aspect-square"
                    src={docInfo.image}
                    alt=""
                />
            </div>

            <div className="flex-1 bg-white border-2 border-[#f0f9fa] rounded-3xl p-8 lg:p-10 shadow-sm relative">
                <div className="flex items-center gap-3">
                    <p className="text-3xl font-extrabold text-gray-900">{docInfo.name}</p>
                    <img className="w-6" src={assets.verified_icon} alt="" />
                </div>
                
                <div className="flex items-center gap-3 mt-3">
                    <p className="text-[#0FB9B1] font-bold bg-[#f0f9fa] px-4 py-1.5 rounded-full text-xs uppercase tracking-wide">
                        {docInfo.degree} - {docInfo.speciality}
                    </p>
                    <span className="py-1 px-3 border-2 border-[#f0f9fa] text-xs font-bold rounded-full text-gray-400">
                        {docInfo.experience}
                    </span>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-[#f0f9fa]">
                    <p className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 bg-[#0FB9B1] rounded-full"></span>
                        Overview
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {docInfo.about}
                    </p>
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Consultation Fee</p>
                    <p className="text-2xl font-black text-[#0FB9B1]">
                        {currencySymbol}{docInfo.fees}
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* Booking Flow Content */}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {step === 1 && (
            <div className="animate-slide-up">
              <div className="flex flex-col xl:flex-row gap-8 mb-10">
                <div className="flex-1">
                  <h2 className="text-lg font-extrabold mb-5 text-gray-800 flex items-center gap-3">
                    <span className="bg-[#0FB9B1] text-white w-6 h-6 rounded flex items-center justify-center text-xs">A</span>
                    Select Appointment Date
                  </h2>
                  <CalendarDatePicker
                    selectedDate={
                      docSlots[slotIndex] && docSlots[slotIndex][0]
                        ? docSlots[slotIndex][0].datetime
                        : new Date()
                    }
                    onDateSelect={(date) => {
                      const index = docSlots.findIndex(
                        (item) =>
                          item[0] &&
                          item[0].datetime.toDateString() ===
                          date.toDateString(),
                      );
                      if (index !== -1) {
                        setSlotIndex(index);
                        setSlotTime("");
                        const firstAvailable = docSlots[index].find(
                          (s) => s.available,
                        );
                        if (firstAvailable) setSlotTime(firstAvailable.time);
                      }
                    }}
                    availableDates={docSlots
                      .map((item) => item[0] && item[0].datetime)
                      .filter(Boolean)}
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-extrabold mb-5 text-gray-800 flex items-center gap-3">
                    <span className="bg-[#0FB9B1] text-white w-6 h-6 rounded flex items-center justify-center text-xs">B</span>
                    Pick a Time Slot
                  </h2>

                  {docSlots.length > 0 &&
                    docSlots[slotIndex] &&
                    docSlots[slotIndex].length > 0 ? (
                    <div className="bg-[#f0f9fa]/50 p-6 rounded-3xl border-2 border-white shadow-sm h-full min-h-[350px]">
                      {(() => {
                        const groups = groupSlotsByPeriod(docSlots[slotIndex]);
                        return (
                          <div className="space-y-6">
                            <SlotGroup
                              title="Morning"
                              slots={groups.morning}
                              selectedTime={slotTime}
                              onSelectSlot={setSlotTime}
                              icon={<span className="text-orange-400">☀️</span>}
                            />
                            <SlotGroup
                              title="Afternoon"
                              slots={groups.afternoon}
                              selectedTime={slotTime}
                              onSelectSlot={setSlotTime}
                              icon={<span className="text-blue-400">🌤️</span>}
                            />
                            <SlotGroup
                              title="Evening"
                              slots={groups.evening}
                              selectedTime={slotTime}
                              onSelectSlot={setSlotTime}
                              icon={<span className="text-indigo-400">🌙</span>}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="bg-[#f0f9fa] border-2 border-dashed border-[#0FB9B1]/20 p-10 rounded-3xl h-full flex flex-col justify-center items-center text-center">
                      <p className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-xs">Unavailable</p>
                      <p className="text-slate-500 font-medium">No slots available for this day.</p>
                      {findNextAvailable() && (
                        <p className="text-xs text-[#0FB9B1] font-bold mt-4 px-4 py-2 bg-white rounded-full shadow-sm">
                          Next Slot: {findNextAvailable()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() =>
                    slotTime
                      ? setStep(2)
                      : toast.info("Please select a time slot")
                  }
                  className="group flex items-center gap-3 px-12 py-4 rounded-full text-white font-bold transition-all shadow-xl active:scale-95"
                  style={{ backgroundColor: slotTime ? '#0FB9B1' : '#e2e8f0', cursor: slotTime ? 'pointer' : 'not-allowed' }}
                >
                  Proceed to Review
                  <span className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-up bg-white p-10 rounded-[40px] border-2 border-[#f0f9fa] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0FB9B1]/5 rounded-full -mr-16 -mt-16"></div>
              
              <h2 className="text-3xl font-black mb-10 text-gray-900 border-b-2 border-[#f0f9fa] pb-6">
                Review <span className="text-[#0FB9B1]">&</span> Confirm
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mb-4">
                      Medical Professional
                    </h3>
                    <div className="flex items-center gap-4 p-4 bg-[#f0f9fa] rounded-2xl border border-white">
                      <img
                        src={docInfo.image}
                        className="w-14 h-14 rounded-xl object-cover bg-[#0FB9B1]/20 shadow-sm"
                        alt=""
                      />
                      <div>
                        <p className="text-lg font-black text-gray-900">{docInfo.name}</p>
                        <p className="text-[#0FB9B1] text-xs font-bold uppercase tracking-wider">
                          {docInfo.speciality}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mb-4">
                      Center Location
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0FB9B1]/10 rounded-full flex items-center justify-center text-[#0FB9B1]">📍</div>
                        <p className="font-bold text-gray-700">Main MediCare Center, HealthLoop Park</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mb-4">
                      Chosen Schedule
                    </h3>
                    <div className="p-6 bg-[#0FB9B1] rounded-3xl border-2 border-white shadow-xl">
                      <p className="text-sm font-bold text-white/80 mb-1 uppercase tracking-widest">
                        {docSlots[slotIndex][0] &&
                          docSlots[slotIndex][0].datetime.toLocaleDateString(
                            "en-US",
                            { weekday: "long", day: "numeric", month: "long" },
                          )}
                      </p>
                      <p className="text-4xl font-black text-white tabular-nums">
                        {slotTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-[#f0f9fa] p-6 rounded-2xl border border-white">
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em]">Total Consultation Fee</p>
                        <p className="text-3xl font-black text-gray-900">
                            {currencySymbol}{docInfo.fees}
                        </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t-2 border-[#f0f9fa] gap-6">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto text-gray-400 hover:text-[#0FB9B1] transition-all font-bold flex items-center gap-2 group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  Modify Details
                </button>
                <button
                  onClick={bookAppointment}
                  className="w-full sm:w-auto bg-[#0FB9B1] hover:brightness-110 text-white font-extrabold px-16 py-4 rounded-full shadow-2xl shadow-[#0FB9B1]/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  Confirm & Secure Booking 
                  <span className="text-lg">✨</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="w-full lg:w-80">
            <div className="sticky top-24">
                <AppointmentSummary
                  docInfo={docInfo}
                  selectedDate={
                    docSlots[slotIndex] && docSlots[slotIndex][0]
                      ? docSlots[slotIndex][0].datetime
                      : null
                  }
                  selectedTime={slotTime}
                  currencySymbol={currencySymbol}
                />
            </div>
          </div>
        )}
      </div>

      {step === 1 && (
        <div className="mt-20">
            <DoctorReviews doctorId={docId} />
            <div className="mt-16">
                <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
            </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto px-4 mt-10">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
      </div>
    </div>
  );
};

export default Appointment;
