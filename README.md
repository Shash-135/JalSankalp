# JalSankalp

Welcome to the **JalSankalp** project—a comprehensive Smart Water Pump Monitoring & Complaint Management System.

## Overview

JalSankalp aims to optimize water pump operations, monitor real-time data, and seamlessly manage complaints from the village level up to the administrative dashboard. 

The project is structured into four main components:

- **Admin Frontend**: A central dashboard for administrators to monitor all pump networks, manage operators, oversee complaints, and view overarching system statistics. Located in the [`admin-frontend/`](./admin-frontend) directory.
- **Operator App**: A mobile application built for ground-level pump operators. Allows them to quickly log pump states, review local complaints, and synchronize offline field data. Located in the [`operator-app/`](./operator-app) directory.
- **Villager Frontend**: A portal designed for villagers to lodge complaints, view public water availability, and connect with administrators. Located in the [`villager-frontend/`](./villager-frontend) directory.
- **Backend**: The core server processing application, handling business logic, data persistence, and system-wide synchronization. Located in the [`backend/`](./backend) directory.

## Getting Started

To get started, navigate to each respective folder and follow their internal README or standard Node.js project launch methods (e.g., `npm install` and `npm run dev` / `npm run android`).

## Installation

Ensure you have Node.js installed locally. 

For the frontend/apps:
```bash
cd [directory-name]
npm install
npm run dev 
npm run android # for the react-native/expo operator-app
```

For the backend:
```bash
cd backend
npm install
npm run dev
```

## Contributing

Make sure to conform to the existing conventions within the respective apps. Regular PRs and reviews help keep the monolithic structure clean.
