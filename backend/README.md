# JALSANKALP Backend

The unified backend for the JALSANKALP Smart Water Pump Monitoring System. Integrates the Admin Dashboard, Villager Portal, and Operator Mobile App.

## Prerequisites

Ensure the following tools and services are installed before proceeding:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MySQL Server**: v8.x
- **MySQL Workbench** (optional, but recommended for visual db management)
- **Android Studio** (with an active Emulator for running the `operator-app`)
- **Java JDK**: 11+
- **React Native CLI environment** configured

## Setup Guide

Follow these steps to set up the entire project locally:

### 1. Database Creation
1. Open MySQL Workbench or your preferred MySQL client.
2. Run the SQL script located at `backend/database/schema.sql`. This will create the `jalsankalp_db` database, all necessary tables, constraints, and insert basic seed data.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and configure it as follows:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=jalsankalp_db
   JWT_SECRET=super_secret_jwt_key_12345
   FRONTEND_ADMIN_URL=http://localhost:5173
   FRONTEND_VILLAGER_URL=http://localhost:5174
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

### 3. Frontend Setup

#### Admin Frontend
1. Open a new terminal and navigate to `admin-frontend/`.
2. Update the API Base URL in `src/services/api.js` to `http://localhost:5000/api`.
3. In `index.css`, ensure theme consistency by using `--color-primary: #2563eb;`.
4. Install and run:
   ```bash
   npm install
   npm run dev
   ```

#### Villager Frontend
1. Open a new terminal and navigate to `villager-frontend/`.
2. Update the API Base URL in `src/services/api.js` to `http://localhost:5000/api`.
3. In `index.css`, ensure theme consistency by using `--color-primary: #2563eb;`.
4. Install and run:
   ```bash
   npm install
   npm run dev
   ```

#### Operator App (React Native)
1. Open a new terminal and navigate to `operator-app/`.
2. Update the API Base URL in `src/constants/index.ts` to `http://10.0.2.2:5000/api`. Set `OFFLINE_MODE` to `false`.
3. In `src/constants/index.ts`, ensure `COLORS.primary` is set to `#2563eb`.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the application on your Android emulator:
   ```bash
   npx react-native run-android
   ```

## API Documentation Structure

### Authentication
- `POST /api/auth/login` (Operator)
- `POST /api/admin/login` (Admin)
- `POST /api/otp/send` (Villager mapping)
- `POST /api/otp/verify` (Villager JWT return)

### Pumps
- `GET /api/pumps` (Admin list)
- `GET /api/pumps/:id` (Admin detail)
- `POST /api/pumps` (Create & Generate QR)
- `PUT /api/pumps/:id` (Update)
- `DELETE /api/pumps/:id` (Delete)

### Pump Operations
- `GET /api/pump/:qr_code` (Villager get details by QR)
- `POST /api/pump/start` (Operator)
- `POST /api/pump/stop` (Operator)
- `POST /api/pump/sync` (Operator offline sync)
- `GET /api/pump/logs` (Operator history)

### Operators
- `GET /api/operator` (Admin list)
- `POST /api/operator` (Admin create)
- `PUT /api/operator/:id` (Admin update)
- `DELETE /api/operator/:id` (Admin delete)

### Complaints
- `POST /api/complaints` (Villager submit + photo upload via Multer)
- `GET /api/complaints` (Admin view)
- `PUT /api/complaints/:id/resolve` (Admin resolve)

### Reports
- `GET /api/reports/pump-usage`
- `GET /api/reports/operator-performance`
- `GET /api/reports/complaints`

### Villagers
- `POST /api/villager/feedback` (Feedback submission)
