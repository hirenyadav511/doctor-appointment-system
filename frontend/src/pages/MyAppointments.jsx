import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import ReviewForm from "../components/ReviewForm";
import "./MyAppointments.css";

const MyAppointments = () => {
  const { backendUrl, token, slotDateFormat } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [reviewModal, setReviewModal] = useState({
    show: false,
    doctorId: null,
    appointmentId: null,
  });
  const [payment, setPayment] = useState("");

  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to make payment using stripe
  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-stripe",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="appointments-wrapper">
      <div className="appointments-container">
        <p className="appointments-title">My appointments</p>
        <div className="animate-slide-up">
          {appointments.map((item, index) => (
            <div key={index} className="appointment-item">
              <div>
                <img
                  className="doc-img-thumb"
                  src={item.docData.image}
                  alt=""
                />
              </div>
              <div className="appointment-details">
                <p className="doc-name">{item.docData.name}</p>
                <p className="doc-spec">{item.docData.speciality}</p>
                <div className="app-meta">
                  <p>
                    <strong>Address:</strong> {item.docData.address.line1},{" "}
                    {item.docData.address.line2}
                  </p>
                  <p>
                    <strong>Date & Time:</strong>{" "}
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>
              </div>

              <div className="appointment-actions">
                <span
                  className={`status-badge ${
                    item.status === "Pending"
                      ? "status-pending"
                      : item.status === "Confirmed"
                        ? "status-confirmed"
                        : item.status === "Cancelled"
                          ? "status-cancelled"
                          : "status-completed"
                  }`}
                >
                  {item.status}
                </span>

                {item.status !== "Cancelled" &&
                  !item.payment &&
                  item.status !== "Completed" &&
                  payment !== item._id && (
                    <button
                      onClick={() => setPayment(item._id)}
                      className="app-btn btn-pay"
                    >
                      Pay Online
                    </button>
                  )}

                {item.status !== "Cancelled" &&
                  !item.payment &&
                  item.status !== "Completed" &&
                  payment === item._id && (
                    <button
                      onClick={() => appointmentStripe(item._id)}
                      className="app-btn flex items-center justify-center p-2"
                    >
                      <img
                        className="max-w-20"
                        src={assets.stripe_logo}
                        alt="Stripe"
                      />
                    </button>
                  )}

                {item.status === "Completed" && !item.isReviewed && (
                  <button
                    onClick={() =>
                      setReviewModal({
                        show: true,
                        doctorId: item.docId,
                        appointmentId: item._id,
                      })
                    }
                    className="app-btn btn-pay"
                  >
                    Leave Review
                  </button>
                )}

                {(item.status === "Pending" || item.status === "Confirmed") && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="app-btn btn-cancel"
                  >
                    Cancel appointment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {reviewModal.show && (
        <ReviewForm
          doctorId={reviewModal.doctorId}
          appointmentId={reviewModal.appointmentId}
          onReviewSubmit={getUserAppointments}
          onClose={() =>
            setReviewModal({ show: false, doctorId: null, appointmentId: null })
          }
        />
      )}
    </div>
  );
};

export default MyAppointments;
