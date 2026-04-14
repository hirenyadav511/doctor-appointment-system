import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import './Banner.css'

const Banner = () => {

  const navigate = useNavigate()

  return (
    <div className='banner-wrapper'>
      <div className='banner-container'>
        <div className='banner-content animate-slide-up'>
          {/* ------- Left Side ------- */}
          <div className='banner-left'>
            <h2 className='banner-title'>
              Book Appointment <br /> With 100+ Trusted Doctors
            </h2>
            <button 
              onClick={() => { navigate('/login'); window.scrollTo(0, 0) }} 
              className='banner-btn'
            >
              Create account
            </button>
          </div>

          {/* ------- Right Side ------- */}
          <div className='banner-right'>
            <img className='banner-img' src={assets.appointment_img} alt="Appointment" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner