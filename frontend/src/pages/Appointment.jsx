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
    <div>
      {/* Step Indicator */}
      <div className="flex items-center justify-center my-8">
        <div
          className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? "border-primary bg-primary text-white" : "border-gray-300"}`}
          >
            1
          </div>
          <span className="ml-2 font-medium">Select Slot</span>
        </div>
        <div className="w-16 h-1 bg-gray-300 mx-4">
          <div
            className={`h-full bg-primary transition-all duration-300 ${step === 2 ? "w-full" : "w-0"}`}
          ></div>
        </div>
        <div
          className={`flex items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? "border-primary bg-primary text-white" : "border-gray-300"}`}
          >
            2
          </div>
          <span className="ml-2 font-medium">Review & Book</span>
        </div>
      </div>

      {/* Content Info */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:max-w-72">
          <img
            className="bg-primary w-full rounded-lg object-cover"
            src={docInfo.image}
            alt=""
          />
        </div>

        <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-8 py-7 bg-white dark:bg-gray-800 mx-2 sm:mx-0 mt-[-80px] sm:mt-0 shadow-sm">
          <div className="flex items-center gap-2 text-3xl font-medium text-gray-700 dark:text-gray-200">
            <p>{docInfo.name}</p>
            <img className="w-5" src={assets.verified_icon} alt="" />
          </div>
          {docInfo.reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={docInfo.rating} size="sm" />
              <span className="text-sm text-gray-500">
                ({docInfo.reviewCount} reviews)
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border dark:border-gray-600 text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>

          <div className="mt-3">
            <p className="flex items-center gap-1 text-sm font-medium text-gray-800 dark:text-gray-200">
              About <img className="w-3" src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[700px] mt-1">
              {docInfo.about}
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800 dark:text-gray-200 font-bold">
              {currencySymbol}
              {docInfo.fees}
            </span>{" "}
          </p>
        </div>
      </div>

      {/* Booking Flow */}
      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {step === 1 && (
            <div className="animate-fade-in transition-all duration-500">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <p className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      01
                    </span>
                    Select Appointment Date
                  </p>
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
                        // Auto-select first available slot on this day
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
                  <p className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      02
                    </span>
                    Available Time Slots
                  </p>

                  {docSlots.length > 0 &&
                    docSlots[slotIndex] &&
                    docSlots[slotIndex].length > 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-full min-h-[300px]">
                      {(() => {
                        const groups = groupSlotsByPeriod(docSlots[slotIndex]);
                        return (
                          <>
                            <SlotGroup
                              title="Morning"
                              slots={groups.morning}
                              selectedTime={slotTime}
                              onSelectSlot={setSlotTime}
                              icon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-orange-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                                  />
                                </svg>
                              }
                            />
                            <SlotGroup
                              title="Afternoon"
                              slots={groups.afternoon}
                              selectedTime={slotTime}
                              onSelectSlot={setSlotTime}
                              icon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-yellow-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                                  />
                                </svg>
                              }
                            />
                            <SlotGroup
                              title="Evening"
                              slots={groups.evening}
                              selectedTime={slotTime}
                              onSelectSlot={setSlotTime}
                              icon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-indigo-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                  />
                                </svg>
                              }
                            />
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 p-6 rounded-2xl h-full flex flex-col justify-center items-center text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-orange-300 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-orange-800 dark:text-orange-400 font-medium">
                        No slots available for this day.
                      </p>
                      {findNextAvailable() && (
                        <p className="text-sm text-orange-600 dark:text-orange-500 mt-2 italic">
                          Next available appointment: {findNextAvailable()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() =>
                    slotTime
                      ? setStep(2)
                      : toast.info("Please select a time slot")
                  }
                  className={`px-10 py-4 rounded-2xl text-white font-bold transition-all transform hover:scale-105 active:scale-95 ${slotTime ? "bg-primary hover:bg-indigo-600 shadow-xl" : "bg-gray-300 cursor-not-allowed"}`}
                >
                  Proceed to Booking
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <p className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Confirm Appointment
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                      Doctor Information
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <img
                        src={docInfo.image}
                        className="w-10 h-10 rounded-full bg-primary/10"
                        alt=""
                      />
                      <div>
                        <p className="text-lg font-bold">{docInfo.name}</p>
                        <p className="text-gray-500 text-sm">
                          {docInfo.speciality}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                      Location
                    </p>
                    <p className="mt-1 font-medium italic text-gray-600 dark:text-gray-400">
                      Main Clinic, HealthLoop Center
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                      Appointment Schedule
                    </p>
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-lg font-bold text-primary">
                        {docSlots[slotIndex][0] &&
                          docSlots[slotIndex][0].datetime.toLocaleDateString(
                            "en-US",
                            { weekday: "long", day: "numeric", month: "long" },
                          )}
                      </p>
                      <p className="text-2xl font-black mt-1 uppercase">
                        {slotTime}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                      Consultation Fee
                    </p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {currencySymbol}
                      {docInfo.fees}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-10 pt-6 border-t dark:border-gray-700">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-primary transition-colors font-medium flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7 7-7"
                    />
                  </svg>
                  Go Back
                </button>
                <button
                  onClick={bookAppointment}
                  className="bg-secondary hover:brightness-110 text-white font-bold px-12 py-4 rounded-2xl shadow-xl shadow-secondary/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  Confirm & Secure Booking
                </button>
              </div>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="w-full lg:w-80">
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
        )}
      </div>

      <DoctorReviews doctorId={docId} />

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-64 rounded-lg w-full md:w-1/3" />
      <Skeleton className="h-32 rounded-lg w-full" />
      <Skeleton className="h-20 rounded-lg w-full" />
    </div>
  );
};

export default Appointment;
