import { assets } from '../assets/assets'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer-wrapper'>
      <div className='footer-container'>
        <div className='footer-grid'>

          {/* Brand Info */}
          <div>
            <img className='footer-logo' src={assets.logo} alt="Medicare Logo" />
            <p className='footer-desc'>
              Medicare is a smart healthcare appointment platform that helps patients
              find trusted doctors, book appointments online, and manage their healthcare
              journey with ease. Secure, fast, and reliable for everyone.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <p className='footer-section-title'>COMPANY</p>
            <ul className='footer-links'>
              <li className='footer-link'>Home</li>
              <li className='footer-link'>About Medicare</li>
              <li className='footer-link'>Our Doctors</li>
              <li className='footer-link'>Privacy Policy</li>
              <li className='footer-link'>Terms & Conditions</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <p className='footer-section-title'>GET IN TOUCH</p>
            <ul className='footer-links'>
              <li className='footer-link'>📞 +91 98765 43210</li>
              <li className='footer-link'>📧 support@medicare.com</li>
              <li className='footer-link'>📍 Ahmedabad, Gujarat, India</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className='footer-bottom'>
          <p className='footer-copyright'>
            © 2026 Medicare. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
