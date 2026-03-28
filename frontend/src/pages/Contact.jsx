import { useState } from "react";
import { assets } from "../assets/assets";
import Banner from "../components/Banner";

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

    // For now just console (later connect backend)
    console.log("Form Data:", formData);

    alert("Message Sent Successfully ✅");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div>
      {/* Heading */}
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      {/* Main Section */}
      <div className="my-10 flex flex-col md:flex-row justify-center gap-10 mb-28 text-sm px-4">

        {/* Left Image */}
        <img
          className="w-full md:max-w-[360px] rounded-lg"
          src={assets.contact_image}
          alt="contact"
        />

        {/* Right Content */}
        <div className="flex flex-col gap-6 w-full max-w-md">

          {/* Contact Info */}
          <div>
            <p className="font-semibold text-lg text-gray-600">
              CONTACT INFO
            </p>

            <p className="text-gray-500 mt-2">
              📍 Ahmedabad, Gujarat, India
            </p>

            <p className="text-gray-500">
              📞 +91 98765 43210 <br />
              📧 support@medicare.com
            </p>
          </div>

          {/* Careers */}
          <div>
            <p className="font-semibold text-lg text-gray-600">
              CAREERS AT MEDICARE
            </p>

            <p className="text-gray-500 mt-2">
              Join our team and explore exciting opportunities in healthcare tech.
            </p>
{/* 
            <button className="mt-3 border border-black px-6 py-2 hover:bg-black hover:text-white transition">
              Explore Careers
            </button> */}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <p className="font-semibold text-lg text-gray-600">
              SEND MESSAGE
            </p>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="border p-2 rounded"
              rows="2"
            />

            <button
              type="submit"
              className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>

        </div>
      </div>

      {/* Banner */}
      <Banner />
    </div>
  );
};

export default Contact;