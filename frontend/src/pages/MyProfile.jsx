import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import './MyProfile.css'

const MyProfile = () => {

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

  // Function to update user profile data using API
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      image && formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return userData ? (
    <div className='profile-wrapper'>
      <div className='profile-container animate-slide-up'>
        
        <div className='profile-header'>
          {isEdit
            ? <label htmlFor='image' className='cursor-pointer'>
                <div className='relative inline-block'>
                  <img className='profile-img-large opacity-50' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                  <img className='w-10 absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2' src={image ? '' : assets.upload_icon} alt="" />
                </div>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
              </label>
            : <img className='profile-img-large' src={userData.image} alt="" />
          }
          
          {isEdit
            ? <input className='edit-input text-3xl font-medium text-center' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
            : <p className='profile-name'>{userData.name}</p>
          }
        </div>

        <p className='section-title'>CONTACT INFORMATION</p>
        <div className='info-grid'>
          <p className='info-label'>Email id:</p>
          <p className='info-value text-primary'>{userData.email}</p>
          
          <p className='info-label'>Phone:</p>
          {isEdit
            ? <input className='edit-input' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
            : <p className='info-value'>{userData.phone}</p>
          }

          <p className='info-label'>Address:</p>
          {isEdit
            ? <div className='flex flex-col gap-2'>
                <input className='edit-input' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
                <input className='edit-input' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} />
              </div>
            : <p className='info-value'>{userData.address.line1} <br /> {userData.address.line2}</p>
          }
        </div>

        <p className='section-title'>BASIC INFORMATION</p>
        <div className='info-grid'>
          <p className='info-label'>Gender:</p>
          {isEdit
            ? <select className='edit-input' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            : <p className='info-value'>{userData.gender}</p>
          }

          <p className='info-label'>Birthday:</p>
          {isEdit
            ? <input className='edit-input' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
            : <p className='info-value'>{userData.dob}</p>
          }
        </div>

        <div className='text-center'>
          {isEdit
            ? <button onClick={updateUserProfileData} className='action-btn btn-primary'>Save information</button>
            : <button onClick={() => setIsEdit(true)} className='action-btn btn-primary'>Edit Profile</button>
          }
        </div>

      </div>
    </div>
  ) : null
}

export default MyProfile