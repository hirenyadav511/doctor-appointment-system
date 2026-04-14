import { useState } from "react";
import { assets } from "../assets/assets";
import Banner from "../components/Banner";
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully ✅");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-page-container">
        <div className="contact-header">
           <p className="contact-header-subtitle">GET IN TOUCH</p>
           <h1 className="contact-header-title">
             CONTACT <span className="text-primary">US</span>
           </h1>
        </div>

        <div className="contact-main-flex animate-slide-up">
          <div className="contact-image-area">
            <img
              className="contact-hero-img"
              src={assets.contact_image}
              alt="Contact Medicare"
            />
          </div>

          <div className="contact-details-area">
            <div className="contact-info-section">
              <h2 className="contact-sub-title">OFFICE <span className="text-primary">INFO</span></h2>
              <div className="contact-links-list">
                <div className="contact-link-item">
                  <span className="contact-icon-box">📍</span>
                  <p>Ahmedabad, Gujarat, India</p>
                </div>
                <div className="contact-link-item">
                  <span className="contact-icon-box">📞</span>
                  <p>+91 98765 43210</p>
                </div>
                <div className="contact-link-item">
                  <span className="contact-icon-box">📧</span>
                  <p>support@medicare.com</p>
                </div>
              </div>
            </div>

            <div className="contact-careers-section">
              <h2 className="contact-sub-title text-primary">CAREERS</h2>
              <p className="contact-careers-text">
                Join our team and explore exciting opportunities in healthcare tech.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form-container">
              <h2 className="contact-sub-title">SEND <span className="text-primary">A MESSAGE</span></h2>
              <div className="contact-input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="contact-input"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="contact-input"
                />
                <textarea
                  name="message"
                  placeholder="Tell us about your concern..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="contact-textarea"
                  rows="3"
                />
                <button type="submit" className="contact-submit-btn">
                  Send Message ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Banner />
    </div>
  );
};

export default Contact;