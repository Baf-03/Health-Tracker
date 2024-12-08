// components/BloodPressureForm.js
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TimePicker from 'react-time-picker';

export default function BloodPressureForm({ onAdd }) {
  const [form, setForm] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    date: '',
    time: 'Morning',
    customTime: '',
    helper: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTimeChange = (time) => {
    setForm({ ...form, customTime: time });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation for custom time
    if (form.time === 'Custom' && !form.customTime) {
      setError('Please provide the custom time');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/blood-pressure/add', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Blood pressure entry added successfully!');
      setForm({
        systolic: '',
        diastolic: '',
        pulse: '',
        date: '',
        time: 'Morning',
        customTime: '',
        helper: '',
      });
      onAdd();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add entry');
      toast.error(err.response?.data?.message || 'Failed to add entry');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded shadow mb-4">
      <h3 className="text-lg mb-2">Add Blood Pressure</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex flex-col md:flex-row space-x-0 md:space-x-2 space-y-2 md:space-y-0 mb-2">
        <input
          type="number"
          name="systolic"
          placeholder="Systolic"
          value={form.systolic}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="diastolic"
          placeholder="Diastolic"
          value={form.diastolic}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="pulse"
          placeholder="Pulse"
          value={form.pulse}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex flex-col md:flex-row space-x-0 md:space-x-2 space-y-2 md:space-y-0 mb-2">
        <div className="w-full">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time of Measurement
          </label>
          <select
            id="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        {form.time === 'Custom' && (
          <div className="w-full flex flex-col">
            <label htmlFor="customTime" className="block text-sm font-medium text-gray-700">
              Select Time
            </label>
            <TimePicker
              id="customTime"
              onChange={handleTimeChange}
              value={form.customTime}
              disableClock
              clearIcon={null}
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={form.time === 'Custom'}
            />
          </div>
        )}
      </div>
      <input
        type="text"
        name="helper"
        placeholder="Helper's Name (e.g., John)"
        value={form.helper}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        aria-label="Helper's Name"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        aria-label="Date of Measurement"
      />
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        Add
      </button>
    </form>
  );
}
