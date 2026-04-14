import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Skeleton from "./Skeleton";
import './TopDoctors.css'

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="topdocs-wrapper">
      <div className="topdocs-container">
        <h1 className="topdocs-title">Top Doctors to Book</h1>
        <p className="topdocs-subtitle">
          Simply browse through our extensive list of trusted doctors, book your appointment hassle-free.
        </p>
        <div className="topdocs-grid">
          {doctors.length === 0
            ? Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="doctor-card">
                  <div className="doctor-img-container">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="doctor-info">
                    <Skeleton className="h-4 w-1/4 mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            : doctors.slice(0, 10).map((item, index) => (
              <div
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  window.scrollTo(0, 0);
                }}
                className="doctor-card animate-slide-up"
                key={index}
              >
                <div className="doctor-img-container">
                  <img
                    className="doctor-img"
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/250x250?text=Doctor";
                    }}
                  />
                </div>
                <div className="doctor-info">
                  <div className={`doctor-status ${item.available ? "status-available" : "status-unavailable"}`}>
                    <p className="status-dot"></p>
                    <p>{item.available ? "Available" : "Not Available"}</p>
                  </div>
                  <p className="doctor-name">{item.name}</p>
                  <p className="doctor-speciality">{item.speciality}</p>
                </div>
              </div>
            ))}
        </div>
        <button
          onClick={() => {
            navigate("/doctors");
            window.scrollTo(0, 0);
          }}
          className="more-btn"
        >
          more
        </button>
      </div>
    </div>
  );
};

export default TopDoctors;
