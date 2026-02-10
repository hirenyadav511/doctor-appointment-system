# HealthLoop - Doctor Appointment Web App

**HealthLoop** is a full-stack web application designed to make healthcare more accessible by simplifying the process of booking doctor appointments. It offers three levels of login: **Patient**, **Doctor**, and **Admin**, each with distinct features tailored to their roles. The app integrates **Stripe online payments** to facilitate seamless and secure transactions. Built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js), HealthLoop provides an efficient and user-friendly experience for both patients and healthcare providers.

---

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Payment Gateway**: Stripe  
- **Authentication**: JSON Web Token (JWT)

---

## 🔑 Key Features

### 👤 Patient Login
- Sign up and login securely.
- Book doctor appointments.
- View, cancel, or reschedule appointments.
- Online payment using **Stripe** or **Cash**.
- Manage profile (name, email, address, gender, birthday, profile picture).

### 🩺 Doctor Login
- View and manage appointments.
- Dashboard showing earnings, patients, and appointments.
- Update profile details (fees, description, availability).
- View appointment details with payment status.

### 🛠️ Admin Login
- Create and manage doctor profiles.
- Dashboard analytics (doctors, patients, appointments).
- Add, edit, or remove doctors.
- Manage all appointments (cancel / mark completed).

---

## 🏠 Home Page
- Search doctors by specialty.
- View top doctors.
- Navigation to About, Privacy Policy, Contact pages.
- Footer with quick links.

---

## 🩺 All Doctors Page
- List of all doctors.
- Filter by specialty.
- Redirect to doctor appointment page.

---

## 📄 About Page
- Information about HealthLoop’s vision and mission.
- Why Choose Us:
  - Efficiency
  - Convenience
  - Personalization

---

## 📞 Contact Page
- Office address and contact details.
- Career opportunities section.

---

## 📅 Doctor Appointment Page
- Doctor details (image, qualification, experience).
- Appointment booking (date & time).
- Payment options: **Cash or Stripe**.
- Related doctors section.
- Login required to book.

---

## 👤 User Profile
- Edit profile information.
- Upload profile picture.
- View appointment history.
- Logout option.

---

## 🗄️ Admin Panel

### Dashboard
- Total doctors, patients, appointments.
- Latest bookings.

### Add Doctor
- Add doctor with full professional details.

### Doctor List
- View, edit, delete doctors.

### Appointments
- View all appointments.
- Cancel or mark as completed.

---

## 🩺 Doctor Dashboard
- Earnings overview.
- Appointment list with patient details.
- Profile management.

---

## 💳 Payment Integration
- **Stripe Payment**
- **Cash Payment**
- Secure and reliable payment handling.

## 🌐 Project Setup

To set up and run this project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/healthloop.git
   cd healthloop
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd client
   npm install
   ```

3. **Environment Variables**:
   - Create a `.env` file in the root directory and add the following:
     ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        STRIPE_SECRET_KEY=your_stripe_secret_key
        STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

     ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

## 📦 Folder Structure

```plaintext
healthloop/
├── client/          # Frontend (React.js)
├── server/          # Backend (Node.js, Express.js)
├── models/          # MongoDB Schemas
├── controllers/     # API Controllers
├── routes/          # API Routes
├── middleware/      # Authentication and Error Handling
├── config/          # Configuration Files
├── utils/           # Utility Functions
├── public/          # Static Files
└── .env             # Environment Variables
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, fork the repository, and open pull requests.


## 🌟 Acknowledgements

- Thanks to the developers and contributors of MongoDB, Express.js, React.js, Node.js, Stripe, and Razorpay for their fantastic tools and libraries.

---

