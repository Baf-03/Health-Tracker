// pages/api/blood-pressure/index.js
import connectToDatabase from '../../../lib/db';
import BloodPressure from '../../../models/BloodPressure';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const { period } = req.query; // 'daily', 'monthly', 'yearly'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectToDatabase();

    let filter = { user: decoded.userId };
    const now = new Date();

    if (period === 'monthly') {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filter.date = { $gte: oneMonthAgo };
    } else if (period === 'yearly') {
      const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      filter.date = { $gte: oneYearAgo };
    }

    const data = await BloodPressure.find(filter).sort({ date: -1 });

    res.status(200).json({ data });
  } catch (error) {
    console.error('Fetch Blood Pressure Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
