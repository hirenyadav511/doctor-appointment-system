# MediCare - Doctor Appointment Web App

**MediCare** is a full-stack web application designed to make healthcare more accessible by simplifying the process of booking doctor appointments. It offers three levels of login: **Patient**, **Doctor**, and **Admin**, each with distinct features tailored to their roles. The app integrates **Stripe online payments** to facilitate seamless and secure transactions. Built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js), MediCare provides an efficient and user-friendly experience for both patients and healthcare providers.

---

## 🛠️ Tech Stack

* **Frontend**: React.js
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Payment Gateway**: Stripe
* **Authentication**: JSON Web Token (JWT)

---

## 🔑 Key Features

### 👤 Patient Login

* Sign up and login securely.
* Book doctor appointments with **Dynamic Time Slots**.
* **Medical History**: View your past diagnoses and prescriptions.
* **Rating & Reviews**: Rate your doctors after completed appointments.
* View, cancel, or reschedule appointments.
* Online payment using **Stripe** or **Cash**.
* Manage profile with profile picture upload.

### 🩺 Doctor Login

* **Availability Calendar**: Set your own working days, times, and slot durations.
* **Medical Record Management**: Add diagnoses and prescriptions for patients.
* **Role-Based Workflow**: Manage appointment lifecycle (Confirm, Start Consultation, Complete).
* Dashboard with earnings and patient growth analytics.
* Profile management with rating display.

### 🛠️ Admin Login

* **Role-Based Workflow**: Manage systems and confirm/cancel appointments.
* Advanced Analytics: Interactive charts for revenue and appointment trends.
* Manage all medical professional profiles. goals.

---

## 🏠 Home Page

* Search doctors by specialty.
* View top doctors.
* Navigation to About, Privacy Policy, Contact pages.
* Footer with quick links.

---

## 🩺 All Doctors Page

* List of all doctors.
* Filter by specialty.
* Redirect to doctor appointment page.

---

## 📄 About Page

* Information about MediCare’s vision and mission.
* Why Choose Us:

  * Efficiency
  * Convenience
  * Personalization

---

## 📞 Contact Page

* Office address and contact details.
* Career opportunities section.

---

## 📅 Doctor Appointment Page

* Doctor details (image, qualification, experience).
* Appointment booking (date & time).
* Payment options: **Cash or Stripe**.
* Related doctors section.
* Login required to book.

---

## 👤 User Profile

* Edit profile information.
* Upload profile picture.
* View appointment history.
* Logout option.

---

## 🗄️ Admin Panel

### Dashboard

* Total doctors, patients, appointments.
* Latest bookings.

### Add Doctor

* Add doctor with full professional details.

### Doctor List

* View, edit, delete doctors.

### Appointments

* View all appointments.
* Confirm or Cancel appointments (Role-Restricted).

---

## 🩺 Doctor Dashboard

* Earnings overview.
* Appointment list with patient details.
* Profile management.

---

## 🏥 Appointment Status Workflow

MediCare implements a professional medical workflow for appointments with strict role-based access control:

* **Patient books appointment** → Status: `Pending`
* **Doctor/Admin confirms** → Status: `Confirmed`
* **Doctor starts consultation** → Status: `Consultation In Progress`
* **Doctor finishes** → Status: `Completed`

### 🎨 Status Indicators (Colored Badges)

* <span style="color: #ca8a04">●</span> **Pending**: Initial booking status.
* <span style="color: #16a34a">●</span> **Confirmed**: Appointment approved by staff.
* <span style="color: #2563eb">●</span> **Consultation In Progress**: Professional medical status during the visit.
* <span style="color: #059669">●</span> **Completed**: Consultation finalized.
* <span style="color: #dc2626">●</span> **Cancelled**: Appointment nullified by patient, doctor, or admin.

---

## 💳 Payment Integration

* **Stripe Payment**
* **Cash Payment**
* Secure and reliable payment handling.

## 🌐 Project Setup

To set up and run this project locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/hirenyadav511/doctor-appointment-system.git
   cd medicare
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   cd client
   npm install
   ```

3. **Environment Variables**:

   * Create a `.env` file in the root directory and add the following:

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
medicare/
├── frontend/        # Patient Dashboard (React.js + Tailwind CSS)
├── admin/           # Admin & Doctor Panel (React.js + Tailwind CSS)
├── backend/         # Node.js & Express.js Server
│   ├── models/      # MongoDB Mongoose Schemas
│   ├── controllers/ # Business Logic & API Controllers
│   ├── routes/      # Express API Routes
│   ├── middleware/  # JWT Auth & Security
│   └── config/      # Database & Cloudinary Connection
└── .env             # Environment Variables
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, fork the repository, and open pull requests.

---

## 🌟 Acknowledgements

* Thanks to the developers and contributors of MongoDB, Express.js, React.js, Node.js, Stripe, and Razorpay for their fantastic tools and libraries.

---
