// models/SugarLevel.js
import mongoose from 'mongoose';

const SugarLevelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  level: {
    type: Number,
    required: [true, 'Sugar level is required'],
  },
  measurement_time: {
    type: String,
    enum: ['before food', 'after food', 'fasting'],
    required: [true, 'Measurement time is required'],
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

export default mongoose.models.SugarLevel || mongoose.model('SugarLevel', SugarLevelSchema);
