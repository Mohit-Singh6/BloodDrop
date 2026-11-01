import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const path = require('path');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Your existing code remains completely unchanged below:
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
import { sendErrorToHealix } from "./utils/healixLogger.js";

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const requestRoutes = require('./routes/requestRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/admin', adminRoutes);
app.get("/api/test-crash", (req, res, next) => {
  try {
    // Deliberate null reference crash
    const dummy = null;
    dummy.someMissingFunction();
  } catch (error) {
    next(error); // Forwards to the Express error handler
  }
});

// GLOBAL EXPRESS ERROR HANDLER for healix
app.use((err, req, res, next) => {
  console.error("Unhandled Route Error:", err);

  // Automatically dispatch to Healix
  sendErrorToHealix({
    serviceName: "blood-donation-api",
    err,
    req,
    statusCode: err.statusCode || err.status || 500,
  });

  // Respond to client
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
  sendErrorToHealix({
    serviceName: "blood-donation-api",
    err: reason instanceof Error ? reason : new Error(String(reason)),
    statusCode: 500,
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  sendErrorToHealix({
    serviceName: "blood-donation-api",
    err,
    statusCode: 500,
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB connected');
  const User = require('./models/User');
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    await User.create({
      name: 'Mohit (Admin)',
      email: 'admin@blooddrop.org',
      password: 'admin123',
      role: 'admin',
      contactNumber: '900090009',
      city: 'System'
    });
    console.log('--------------------------------------------------');
    console.log('SEEDED DEFAULT ADMIN ACCOUNT');
    console.log('Email:    admin@blooddrop.org');
    console.log('Password: admin123');
    console.log('--------------------------------------------------');
  }
})
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
