// models/BloodPressure.js
import mongoose from 'mongoose';

const BloodPressureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  systolic: {
    type: Number,
    required: [true, 'Systolic pressure is required'],
  },
  diastolic: {
    type: Number,
    required: [true, 'Diastolic pressure is required'],
  },
  pulse: {
    type: Number,
  },
  time: { // New field for time of measurement
    type: String,
    required: [true, 'Time of measurement is required'],
    enum: ['Morning', 'Afternoon', 'Evening', 'Night', 'Custom'], // Predefined options
  },
  customTime: { // Optional field for custom time input
    type: String,
  },
  helper: { // New field for who helped
    type: String,
    trim: true,
    maxlength: [100, 'Helper name cannot exceed 100 characters'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.BloodPressure || mongoose.model('BloodPressure', BloodPressureSchema);
