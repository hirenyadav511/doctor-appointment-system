import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import './SpecialityMenu.css'

const SpecialityMenu = () => {
  return (
    <div id="speciality" className="speciality-wrapper">
      <div className="speciality-container">
        <h1 className="speciality-title">Find by Speciality</h1>
        <p className="speciality-subtitle">
          Simply browse through our extensive list of trusted doctors, schedule
          your appointment hassle-free.
        </p>
        <div className="speciality-list">
          {specialityData.map((item, index) => (
            <Link
              to={`/doctors/${item.speciality}`}
              onClick={() => window.scrollTo(0, 0)}
              className="speciality-card animate-slide-up"
              style={{ paddingBottom: '20px' }}
              key={index}
            >
              <img className="speciality-img" src={item.image} alt={item.speciality} />
              <p className="speciality-name">{item.speciality}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialityMenu;
