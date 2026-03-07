const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/operator', require('./routes/operatorRoutes'));
app.use('/api/pumps', require('./routes/pumpRoutes'));
app.use('/api/pump', require('./routes/pumpOperationRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/villager', require('./routes/villagerRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));
app.use('/api/areas', require('./routes/areaRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Basic health check
app.get('/', (req, res) => {
  res.send('JALSANKALP API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
