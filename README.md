# Freelance.dev - Premium Auth Monorepo

A high-end, full-stack authentication system built with the MERN stack (MongoDB, Express, React, Node.js). This project features a decoupled MVC architecture, dual-channel OTP verification (Email & SMS), and a premium glassmorphic UI.

## 🚀 Features

- **Decoupled Architecture**: Separate `frontend` and `backend` services optimized for individual deployment (Vercel & Render).
- **Premium UI/UX**: Dark-themed, modern interface using DM Serif Display and DM Sans typography.
- **Dual OTP Delivery**:
  - 📧 **Email**: Integrated via **EmailJS** for secure password recovery.
  - 📱 **SMS**: Integrated via **Twilio** for mobile-based verification.
- **Secure Authentication**: 
  - Password hashing with **Bcrypt**.
  - State management via **JWT** (JSON Web Tokens).
  - Secure storage of sessions.
- **Full MVC Pattern**: Clean separation of Models, Views, and Controllers on both ends.

## 📂 Project Structure

```text
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   └── server.ts     # Entry point
│   └── .env              # Backend secrets
└── frontend/             # React + Vite UI
    ├── src/
    │   ├── controllers/  # API client handlers
    │   ├── views/        # UI Components
    │   └── main.tsx      # App routing
    └── .env              # Public environment variables
```

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone git@github.com:prathameshkamble979/Fullstack_Auth.git
```

### 2. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Configure your `.env` file (see below).
4. Run in development: `npm run dev`

### 3. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Configure your `.env` file (see below).
4. Run in development: `npm run dev`

## 🔑 Environment Variables

### Backend (`backend/.env`)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Random string for JWT encryption
- `TWILIO_SID`: Twilio Account SID
- `TWILIO_TOKEN`: Twilio Auth Token
- `TWILIO_PHONE_NUMBER`: Your Twilio virtual number
- `EMAILJS_SERVICE_ID`: EmailJS Service ID
- `EMAILJS_TEMPLATE_ID`: EmailJS Template ID
- `EMAILJS_PUBLIC_KEY`: EmailJS Public Key
- `EMAILJS_PRIVATE_KEY`: EmailJS Private Key (Required for Node.js)

### Frontend (`frontend/.env`)
- `VITE_API_URL`: URL of your backend API (e.g., `http://localhost:5000/api`)
- `VITE_EMAILJS_SERVICE_ID`: EmailJS Service ID
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS Template ID
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS Public Key

## 📦 Deployment

- **Frontend**: Best hosted on **Vercel**. Ensure `rewrites` are configured (already included in `vercel.json`).
- **Backend**: Best hosted on **Render** or **Railway**. Use `npm run build` and `npm start`.

---
Built with ❤️ for Freelance.dev
