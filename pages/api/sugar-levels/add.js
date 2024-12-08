// pages/api/sugar-levels/add.js
import connectToDatabase from '../../../lib/db';
import SugarLevel from '../../../models/SugarLevel';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectToDatabase();

    const { level, measurement_time, date, time, customTime, helper } = req.body;

    if (!level || !measurement_time || !time) {
      return res.status(400).json({ message: 'Level, Measurement Time, and Time are required' });
    }

    // If time is 'Custom', ensure customTime is provided
    if (time === 'Custom' && !customTime) {
      return res.status(400).json({ message: 'Please provide the custom time' });
    }

    const sugarEntry = await SugarLevel.create({
      user: decoded.userId,
      level,
      measurement_time,
      time,
      customTime: time === 'Custom' ? customTime : null,
      helper: helper || null,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({ entry: sugarEntry });
  } catch (error) {
    console.error('Add Sugar Level Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
