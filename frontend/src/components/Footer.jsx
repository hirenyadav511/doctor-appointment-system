import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* Brand Info */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="Medicare Logo" />
          <p className='w-full md:w-2/3 text-gray-600 dark:text-gray-400 leading-6'>
            Medicare is a smart healthcare appointment platform that helps patients
            find trusted doctors, book appointments online, and manage their healthcare
            journey with ease. Secure, fast, and reliable for everyone.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className='text-xl font-medium mb-5 text-gray-800 dark:text-white'>
            COMPANY
          </p>
          <ul className='flex flex-col gap-2 text-gray-600 dark:text-gray-400'>
            <li className='cursor-pointer hover:text-blue-600'>Home</li>
            <li className='cursor-pointer hover:text-blue-600'>About Medicare</li>
            <li className='cursor-pointer hover:text-blue-600'>Our Doctors</li>
            <li className='cursor-pointer hover:text-blue-600'>Privacy Policy</li>
            <li className='cursor-pointer hover:text-blue-600'>Terms & Conditions</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className='text-xl font-medium mb-5 text-gray-800 dark:text-white'>
            GET IN TOUCH
          </p>
          <ul className='flex flex-col gap-2 text-gray-600 dark:text-gray-400'>
            <li>📞 +91 98765 43210</li>
            <li>📧 support@medicare.com</li>
            <li>📍 Ahmedabad, Gujarat, India</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div>
        <hr className='border-gray-300 dark:border-gray-700' />
        <p className='py-5 text-sm text-center text-gray-600 dark:text-gray-400'>
          © 2026 Medicare. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
