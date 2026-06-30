# JalSankalp 💧

Welcome to **JalSankalp**—a comprehensive Smart Water Pump Monitoring & Complaint Management System designed to optimize water distribution, monitor real-time pump data, and seamlessly manage villager complaints from the ground level up to the administrative dashboard.

## 🌐 Live Demos & Links

You can explore the entire JalSankalp ecosystem live without needing to run any code locally!

* **Admin Dashboard:** [https://jalsankalp-admin.vercel.app](https://jalsankalp-admin.vercel.app)
* **Villager Portal:** [https://jalsankalp-villager.vercel.app](https://jalsankalp-villager.vercel.app)
* **Backend API:** [https://jalsankalp.onrender.com](https://jalsankalp.onrender.com) (Render Free Tier)

### 🔐 Demo Credentials
To test the secure areas of the applications, use the following demo accounts:

**Admin Account** (For Admin Dashboard)
- **Email:** `admin1@example.com`
- **Password:** `admin123`

**Operator Account** (For the Android App)
- **Email:** `operator1@example.com`
- **Password:** `admin123`

*(Note: The Villager Portal uses an Email OTP system. You can enter your own email to test it. If the email doesn't arrive due to spam filters, you can use the master bypass code `123456` to log in instantly.)*

---

## 📱 JalSankalp Operator App (Android)

Ground-level pump operators use a dedicated mobile application to log pump states, manage offline field data, and sync with the central server. 

### How to Install & Test
1. Go to the **[Releases](../../releases)** tab on this GitHub repository.
2. Download the latest `JalSankalp-Operator-App.apk` file to your Android smartphone.
3. Open the downloaded `.apk` file. 
4. *Note: Your phone may prompt you to "Allow installation from unknown sources". Please enable this to proceed.*
5. Once installed, open the app and log in using the **Operator Demo Credentials** listed above!

---

## 🏗️ Project Architecture

The project is structured into four main components inside this monorepo:

1. **`admin-frontend/`**: A central dashboard built with React for administrators to monitor pump networks, oversee complaints, and view overarching system statistics.
2. **`villager-frontend/`**: A public portal built with React for villagers to lodge complaints, track issue resolution, and view water availability.
3. **`operator-app/`**: A React Native (Expo) mobile application for field operators.
4. **`backend/`**: A Node.js/Express server that acts as the central brain. It handles the REST API, integrates with TiDB (MySQL), Cloudinary for image hosting, and Resend for email OTPs.

---

## 💻 Local Development Setup

If you wish to run the code locally on your own machine:

### Prerequisites
- Node.js (v18+)
- TiDB or MySQL Database instance
- Cloudinary Account (for image uploads)
- Resend API Key (for emails)

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory with your database and API credentials, then run:
```bash
npm run dev
```

### 2. Frontend Setup (Admin & Villager)
Open a new terminal for each frontend:
```bash
cd admin-frontend
npm install
npm run dev 
```

### 3. Operator App Setup
```bash
cd operator-app
npm install
npm run start
```
