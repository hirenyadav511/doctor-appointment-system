import { assets } from "../assets/assets";
import Banner from "../components/Banner";
import './About.css';

const About = () => {
  return (
    <div className='about-page-wrapper'>
      <div className='about-page-container'>
        <div className="about-header">
           <p className="about-header-discover">DISCOVER</p>
           <h1 className="about-header-title">
             ABOUT <span className="text-primary">MEDICARE</span>
           </h1>
        </div>

        <div className="about-main-content animate-slide-up">
           <div className="about-image-column">
              <img
                className="about-hero-img"
                src={assets.about_image}
                alt="About Medicare"
              />
           </div>
           <div className="about-text-column">
             <p className="about-intro-text">
               Welcome to <span className="text-primary font-extrabold">Medicare</span>, your trusted partner in managing your
               healthcare needs conveniently and efficiently. 
             </p>
             <div className="about-description">
                <p>
                  At Medicare, we understand the challenges individuals face when it comes to
                  scheduling doctor appointments and managing their health records. We bridge the gap between patients and healthcare providers, ensuring everyone gets the care they deserve.
                </p>
                <p>
                  Medicare is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service.
                </p>
             </div>
             <div className="about-vision-card">
                 <p className="about-vision-label">OUR VISION</p>
                 <p className="about-vision-text">
                   Our vision at Medicare is to create a seamless healthcare experience
                   for every user. We aim to bridge the gap between patients and
                   healthcare providers, making it easier for you to access the care
                   you need, when you need it.
                 </p>
             </div>
           </div>
        </div>

        <div className="about-why-choose-header border-t">
           <p className="about-subtitle">THE DIFFERENCE</p>
           <h2 className="about-grid-title">WHY <span className="text-primary">CHOOSE US?</span></h2>
        </div>

        <div className="about-features-grid border">
          <div className="about-feature-item">
            <b className="about-feature-num text-primary">01. </b>
            <b className="about-feature-title">EFFICIENCY:</b>
            <p className="about-feature-desc">
              Streamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>
          <div className="about-feature-item">
            <b className="about-feature-num text-primary">02. </b>
            <b className="about-feature-title">CONVENIENCE: </b>
            <p className="about-feature-desc">
              Access to a network of trusted healthcare professionals in your
              area.
            </p>
          </div>
          <div className="about-feature-item">
            <b className="about-feature-num text-primary">03. </b>
            <b className="about-feature-title">PERSONALIZATION:</b>
            <p className="about-feature-desc">
              Tailored recommendations and reminders to help you stay on top of
              your health.
            </p>
          </div>
        </div>
      </div>
      <Banner />
    </div>
  );
};

export default About;
