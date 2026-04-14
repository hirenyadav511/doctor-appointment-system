import { assets } from '../assets/assets'
import './Header.css'

const Header = () => {
  return (
    <div className='hero-wrapper'>
      <div className='hero-content'>
        
        {/* --------- Left Section --------- */}
        <div className='hero-left animate-slide-up'>
          <h1 className='hero-title'>
            Book Appointment <br /> With <span>Trusted Doctors</span>
          </h1>
          
          <div className='hero-info-group'>
            <div className='avatar-group'>
              <img className='avatar-img' src={assets.group_profiles} alt="" style={{ width: 'auto', borderRadius: '0', border: 'none' }} />
              {/* Note: In the original project 'group_profiles' is a single image containing avatars. 
                  If individual assets are not available, we use the single group asset as per user project structure. */}
            </div>
            <p className='hero-desc'>
              Simply browse through our extensive list of trusted doctors, 
              schedule your appointment hassle-free today.
            </p>
          </div>

          <a href='#speciality' className='hero-btn'>
            Book appointment <img className='w-3' src={assets.arrow_icon} alt="" />
          </a>
        </div>

        {/* --------- Right Section --------- */}
        <div className='hero-right animate-slide-up'>
          <div className='hero-bg-circle'></div>
          <img className='hero-img' src={assets.header_img} alt="Doctors Team" />
        </div>
      </div>
    </div>
  )
}

export default Header