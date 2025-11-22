 🩺 **Prescripto – Doctor Appointment Booking App**

A full-stack MERN application for booking doctor appointments, managing schedules, making online payments (Razorpay), and handling user/doctor admin dashboards.

 👤 **User Features**

* Register & Login with JWT Authentication
* Browse available doctors
* Book appointments
* Cancel appointments
* Online payment via Razorpay
* View booked appointments
* Update user profile

 🩺 **Doctor Features**

* Login & manage profile
* View appointments
* Approve / Cancel bookings

 🛠 **Admin Features**

* Manage doctors
* Approve doctor applications
* View appointments


 🧩 **Tech Stack**

**Frontend**

* React.js
* React Router
* Axios
* Tailwind / CSS
* React Toastify

 **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Razorpay Payment Gateway

 📂 **Project Structure**

```
Prescripto/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.js

⚙️ **Backend Setup**

### 1️⃣ Install dependencies

```
cd backend
npm install
```

### 2️⃣ Add environment variables

Create a `.env` file:

```
PORT=4000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 3️⃣ Start server

```
npm run dev
```

---

## 🎨 **Frontend Setup**

### 1️⃣ Install dependencies

```
cd frontend
npm install
```

### 2️⃣ Add environment variables (optional)

Create `.env` inside frontend:

```
VITE_BACKEND_URL=http://localhost:4000
```

### 3️⃣ Start frontend

```
npm run dev
```

---

## 💳 **Razorpay Payment Flow**

* User clicks “Pay Online”
* Backend creates Razorpay order
* Razorpay checkout opens
* On success → backend marks appointment as paid

---

## 📌 **Environment Variables Summary**

| Variable              | Description               |
| --------------------- | ------------------------- |
| `PORT`                | Backend port              |
| `MONGO_URI`           | MongoDB connection string |
| `JWT_SECRET`          | Token signing secret      |
| `RAZORPAY_KEY_ID`     | Razorpay key              |
| `RAZORPAY_KEY_SECRET` | Razorpay secret           |

---

## 🔐 **Authentication**

* JWT based
* Tokens stored in localStorage
* Protected routes for user, doctor, and admin

---

## 📬 **API Routes (Quick Overview)**

### **User Routes**

```
POST /api/user/register
POST /api/user/login
GET  /api/user/profile
POST /api/user/payment-razorpay
POST /api/user/book-appointment
POST /api/user/cancel-appointment
```

### **Doctor Routes**

```
POST /api/doctor/login
GET  /api/doctor/appointments
```

### **Admin Routes**

```
GET  /api/admin/doctors
POST /api/admin/update-status
```

---

## 🖼 **Screenshots (Add if available)**

* User Dashboard
* Doctor List
* Appointment Page
* Payment Page
* Admin Dashboard

---

## 📦 **Build for Production**

### Frontend build:

```
cd frontend
npm run build
```

### Backend start:

```
cd backend
npm start
```

---

## 🤝 **Contributing**

Pull requests are welcome.
For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 **License**

This project is open-source and free to use.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
