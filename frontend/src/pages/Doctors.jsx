import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import Banner from "../components/Banner";
import './Doctors.css'

const Doctors = () => {
  const { speciality } = useParams();

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="doctors-page-wrapper">
      <div className="doctors-page-container">
        <p className="doctors-header-text">
          Browse through the doctors specialist.
        </p>
        
        <div className="doctors-flex-layout">
          <div className="doctors-sidebar animate-slide-up">
            {[
              "General physician",
              "Gynecologist",
              "Dermatologist",
              "Pediatricians",
              "Neurologist",
              "Gastroenterologist",
            ].map((spec) => (
              <p
                key={spec}
                onClick={() =>
                  speciality === spec
                    ? navigate("/doctors")
                    : navigate(`/doctors/${spec}`)
                }
                className={`filter-btn ${speciality === spec ? "active" : ""}`}
              >
                {spec}
              </p>
            ))}
          </div>

          <div className="doctors-grid">
            {filterDoc.length === 0 && doctors.length === 0
              ? Array(8)
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
              : filterDoc.map((item, index) => (
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
        </div>
      </div>
      <Banner />
    </div>
  );
};

export default Doctors;
