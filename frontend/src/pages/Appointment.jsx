import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import Skeleton from "../components/Skeleton";
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
    let today = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
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

          if (today.toDateString() === currentDate.toDateString()) {
            const now = new Date();
            if (slotStart < now) {
              slotStart = new Date(now);
              slotStart.setMinutes(slotStart.getMinutes() + 1);
              const remains = slotStart.getMinutes() % avail.slotDuration;
              if (remains !== 0) {
                slotStart.setMinutes(slotStart.getMinutes() + (avail.slotDuration - remains));
              }
              slotStart.setSeconds(0, 0);
            }
          }

          while (slotStart < slotEnd) {
            let formattedTime = slotStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            let day = slotStart.getDate();
            let month = slotStart.getMonth() + 1;
            let year = slotStart.getFullYear();
            const slotDate = day + "_" + month + "_" + year;
            const isBooked = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime);

            timeSlots.push({
              datetime: new Date(slotStart),
              time: formattedTime,
              available: !isBooked,
              availabilityStatus: isBooked ? "booked" : Math.random() > 0.8 ? "few" : "available",
            });
            slotStart.setMinutes(slotStart.getMinutes() + avail.slotDuration);
          }
        });
      }
      allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);

    if (allSlots.length > 0) {
      for (let i = 0; i < allSlots.length; i++) {
        const firstAvailable = allSlots[i].find((s) => s.available);
        if (firstAvailable) {
          setSlotIndex(i);
          setSlotTime(firstAvailable.time);
          break;
        }
      }
    }
  };

  const groupSlotsByPeriod = (slots) => {
    const groups = { morning: [], afternoon: [], evening: [] };
    if (!slots) return groups;
    slots.forEach((slot) => {
      const hour = slot.datetime.getHours();
      if (hour >= 6 && hour < 12) groups.morning.push(slot);
      else if (hour >= 12 && hour < 17) groups.afternoon.push(slot);
      else if (hour >= 17 && hour < 22) groups.evening.push(slot);
    });
    return groups;
  };

  const findNextAvailable = () => {
    for (let i = slotIndex + 1; i < docSlots.length; i++) {
      const firstAvailable = docSlots[i].find((s) => s.available);
      if (firstAvailable) {
        const date = docSlots[i][0].datetime;
        const dayName = i === 1 ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "long" });
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
    const slotDate = date.getDate() + "_" + (date.getMonth() + 1) + "_" + date.getFullYear();

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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-[#0FB9B1]" : "text-gray-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-[#0FB9B1] text-white" : "bg-gray-100"}`}>1</span>
            <span className="text-sm font-semibold text-gray-700">Select Date & Time</span>
          </div>
          <div className="w-12 h-px bg-gray-200"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-[#0FB9B1]" : "text-gray-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-[#0FB9B1] text-white" : "bg-gray-100"}`}>2</span>
            <span className="text-sm font-semibold text-gray-700">Review Summary</span>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start shadow-sm transition-all duration-300">
            <img className="w-32 h-32 bg-gray-50 rounded-lg object-cover" src={docInfo.image} alt="" />
            <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-800">{docInfo.name}</h1>
                    <img className="w-5" src={assets.verified_icon} alt="" />
                </div>
                <p className="text-[#0FB9B1] font-medium text-sm mb-4">
                    {docInfo.degree} - {docInfo.speciality} • {docInfo.experience}
                </p>
                <div className="max-w-3xl">
                    <p className="text-gray-500 text-sm leading-relaxed">{docInfo.about}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-center sm:justify-start gap-6">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Fee</p>
                        <p className="text-lg font-bold text-gray-800">{currencySymbol}{docInfo.fees}</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {step === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8 animate-slide-up">
              {/* Select Date Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-sm font-bold mb-4 text-gray-800 uppercase tracking-wide">1. Select Date</h2>
                  <CalendarDatePicker
                    selectedDate={docSlots[slotIndex]?.[0]?.datetime || new Date()}
                    onDateSelect={(date) => {
                      const index = docSlots.findIndex(item => item[0]?.datetime.toDateString() === date.toDateString());
                      if (index !== -1) {
                        setSlotIndex(index);
                        setSlotTime("");
                        const firstAvailable = docSlots[index].find(s => s.available);
                        if (firstAvailable) setSlotTime(firstAvailable.time);
                      }
                    }}
                    availableDates={docSlots.map(item => item[0]?.datetime).filter(Boolean)}
                  />
                </div>

                <div>
                  <h2 className="text-sm font-bold mb-4 text-gray-800 uppercase tracking-wide">2. Pick a Slot</h2>
                  {docSlots[slotIndex]?.length > 0 ? (
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full min-h-[350px]">
                      {(() => {
                        const groups = groupSlotsByPeriod(docSlots[slotIndex]);
                        return (
                          <div className="space-y-8">
                            <SlotGroup title="Morning" slots={groups.morning} selectedTime={slotTime} onSelectSlot={setSlotTime} icon={<span className="text-xs">☀️</span>} />
                            <SlotGroup title="Afternoon" slots={groups.afternoon} selectedTime={slotTime} onSelectSlot={setSlotTime} icon={<span className="text-xs">🌤️</span>} />
                            <SlotGroup title="Evening" slots={groups.evening} selectedTime={slotTime} onSelectSlot={setSlotTime} icon={<span className="text-xs">🌙</span>} />
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-100 p-10 rounded-xl h-full flex flex-col justify-center items-center text-center">
                      <p className="text-gray-400 font-medium mb-1 text-[10px] uppercase tracking-wider">No Slots Available</p>
                      <p className="text-gray-500 text-sm">Please select another date</p>
                      {findNextAvailable() && (
                        <p className="text-xs text-[#0FB9B1] font-semibold mt-4 px-3 py-1.5 bg-white rounded-full border border-[#0FB9B1]/20">Next: {findNextAvailable()}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => slotTime ? setStep(2) : toast.info("Please select a time slot")}
                  className="px-10 py-3 rounded-lg text-white font-bold transition-all shadow-md active:scale-95 text-sm"
                  style={{ backgroundColor: slotTime ? '#0FB9B1' : '#e2e8f0', cursor: slotTime ? 'pointer' : 'not-allowed' }}
                >
                  Continue Review →
                </button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="w-full">
                <div className="sticky top-10">
                    <AppointmentSummary 
                        docInfo={docInfo} 
                        selectedDate={docSlots[slotIndex]?.[0]?.datetime} 
                        selectedTime={slotTime} 
                        currencySymbol={currencySymbol} 
                    />
                </div>
            </div>
        </div>
      ) : (
        /* Step 2: Confirmation */
        <div className="flex justify-center py-5">
            <div className="animate-slide-up bg-white p-8 md:p-12 rounded-xl border border-gray-100 shadow-sm w-full max-w-4xl">
              <div className="text-center mb-10 pb-6 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Booking Confirmation</h2>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Please review your appointment details before confirming</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Left Side: Professional & Location */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest border-l-2 border-[#0FB9B1] pl-2">Professional & Location</p>
                    <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-xl">
                      <img src={docInfo.image} className="w-20 h-20 rounded-xl bg-white object-cover shadow-sm border-2 border-white" alt="" />
                      <div>
                        <p className="text-lg font-bold text-gray-800">{docInfo.name}</p>
                        <p className="text-[#0FB9B1] text-xs font-bold uppercase mb-2">{docInfo.speciality}</p>
                        <p className="text-[11px] text-gray-500 font-medium">📍 Main Clinic, HealthLoop Medical Park</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Instructions</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">Please arrive 10 minutes before your scheduled time. Bring any relevant medical reports for consultation.</p>
                  </div>
                </div>

                {/* Right Side: Schedule & Fee */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest border-l-2 border-[#0FB9B1] pl-2">Scheduled Time</p>
                    <div className="p-6 bg-[#0FB9B1] rounded-xl text-white shadow-lg shadow-[#0FB9B1]/10 flex flex-col items-center text-center">
                      <p className="text-[11px] font-bold uppercase opacity-80 mb-2">{docSlots[slotIndex][0]?.datetime.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}</p>
                      <p className="text-3xl font-black">{slotTime}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl flex justify-between items-center border border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Consultation Fee</p>
                      <p className="text-sm text-gray-500 font-medium italic">Standard service tax included</p>
                    </div>
                    <p className="text-3xl font-black text-gray-800 tracking-tight">{currencySymbol}{docInfo.fees}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-14 pt-8 border-t border-gray-50">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 transition-all text-[10px] font-bold uppercase tracking-widest order-2 md:order-1">← Modify Appointment Details</button>
                <button onClick={bookAppointment} className="w-full md:w-auto px-16 bg-[#0FB9B1] hover:brightness-105 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 text-sm uppercase tracking-wider order-1 md:order-2">Confirm & Book Now</button>
              </div>
            </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-16 pt-16 border-t border-gray-100">
            <DoctorReviews doctorId={docId} />
            <div className="mt-16">
                <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
            </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto px-4 mt-16">
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
};

export default Appointment;
