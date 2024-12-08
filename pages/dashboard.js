// pages/dashboard.js
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import 'chart.js/auto';
import BloodPressureForm from '../components/BloodPressureForm';
import SugarLevelForm from '../components/SugarLevelForm';
import { FaChartLine } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [bloodPressure, setBloodPressure] = useState([]);
  const [sugarLevels, setSugarLevels] = useState([]);
  const [averageBP, setAverageBP] = useState({ systolic: 0, diastolic: 0 });
  const [averageSugar, setAverageSugar] = useState(0);
  const [period, setPeriod] = useState('daily');
  const [bpChartType, setBpChartType] = useState('Line');
  const [sugarChartType, setSugarChartType] = useState('Line');

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Fetch Blood Pressure Data
      const bpRes = await axios.get(`/api/blood-pressure?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBloodPressure(bpRes.data.data);

      // Fetch Sugar Levels Data
      const sugarRes = await axios.get(`/api/sugar-levels?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSugarLevels(sugarRes.data.data);

      // Calculate Averages
      if (bpRes.data.data.length > 0) {
        const avgSystolic =
          bpRes.data.data.reduce((a, b) => a + b.systolic, 0) /
          bpRes.data.data.length;
        const avgDiastolic =
          bpRes.data.data.reduce((a, b) => a + b.diastolic, 0) /
          bpRes.data.data.length;
        setAverageBP({ systolic: avgSystolic, diastolic: avgDiastolic });
      } else {
        setAverageBP({ systolic: 0, diastolic: 0 });
      }

      if (sugarRes.data.data.length > 0) {
        const avgSugar =
          sugarRes.data.data.reduce((a, b) => a + b.level, 0) /
          sugarRes.data.data.length;
        setAverageSugar(avgSugar);
      } else {
        setAverageSugar(0);
      }
    } catch (error) {
      console.error('Fetch Data Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, user]);

  // Function to determine color based on blood pressure values
  const getBPColor = (value, type) => {
    if (type === 'systolic') {
      return value > 130 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.6)';
    } else if (type === 'diastolic') {
      return value > 80 ? 'rgba(255, 159, 64, 0.6)' : 'rgba(153, 102, 255, 0.6)';
    }
    return 'rgba(54, 162, 235, 0.6)';
  };

  // Function to determine color based on sugar level
  const getSugarColor = (value) => {
    return value > 140 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.6)';
  };

  // Prepare data for Blood Pressure Chart
  const prepareBPChartData = () => {
    const labels = bloodPressure.map((entry) =>
      new Date(entry.date).toLocaleDateString()
    );
    const systolicData = bloodPressure.map((entry) => entry.systolic);
    const diastolicData = bloodPressure.map((entry) => entry.diastolic);

    return {
      labels,
      datasets: [
        {
          label: 'Systolic',
          data: systolicData,
          backgroundColor: systolicData.map((val) => getBPColor(val, 'systolic')),
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Diastolic',
          data: diastolicData,
          backgroundColor: diastolicData.map((val) => getBPColor(val, 'diastolic')),
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for Sugar Level Chart
  const prepareSugarChartData = () => {
    const labels = sugarLevels.map((entry) =>
      new Date(entry.date).toLocaleDateString()
    );
    const sugarData = sugarLevels.map((entry) => entry.level);

    return {
      labels,
      datasets: [
        {
          label: 'Sugar Level (mg/dL)',
          data: sugarData,
          backgroundColor: sugarData.map((val) => getSugarColor(val)),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Function to export data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Health Tracker Report', 14, 22);

    // Report Date
    doc.setFontSize(12);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 28);

    // Blood Pressure Table
    doc.setFontSize(14);
    doc.text('Blood Pressure History', 14, 32);
    const bpTableColumn = ['Date', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Helper'];
    const bpTableRows = [];

    bloodPressure.forEach((entry) => {
      const entryData = [
        new Date(entry.date).toLocaleDateString(),
        entry.time === 'Custom' ? entry.customTime : entry.time,
        entry.systolic,
        entry.diastolic,
        entry.pulse || 'N/A',
        entry.helper || 'N/A',
      ];
      bpTableRows.push(entryData);
    });

    doc.autoTable({
      head: [bpTableColumn],
      body: bpTableRows,
      startY: 36,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }, // Blue header
    });

    // Sugar Levels Table
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Sugar Levels History', 14, finalY);
    const sugarTableColumn = ['Date', 'Time', 'Level (mg/dL)', 'Measurement Time', 'Helper'];
    const sugarTableRows = [];

    sugarLevels.forEach((entry) => {
      const entryData = [
        new Date(entry.date).toLocaleDateString(),
        entry.time === 'Custom' ? entry.customTime : entry.time,
        entry.level,
        entry.measurement_time,
        entry.helper || 'N/A',
      ];
      sugarTableRows.push(entryData);
    });

    doc.autoTable({
      head: [sugarTableColumn],
      body: sugarTableRows,
      startY: finalY + 4,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 152, 219] }, // Blue header
    });

    // Save PDF
    doc.save('health_tracker_report.pdf');
  };

  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-3xl mb-4 flex items-center">
          <FaChartLine className="mr-2" /> Dashboard
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <label htmlFor="period" className="font-medium">
              Select Period:
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <button
            onClick={exportToPDF}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Export to PDF
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Blood Pressure Section */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl">Blood Pressure</h2>
              <div>
                <label htmlFor="bpChartType" className="mr-2">
                  Chart Type:
                </label>
                <select
                  id="bpChartType"
                  value={bpChartType}
                  onChange={(e) => setBpChartType(e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="Line">Line</option>
                  <option value="Bar">Bar</option>
                  <option value="Radar">Radar</option>
                  <option value="PolarArea">Polar Area</option>
                </select>
              </div>
            </div>
            <p>
              <strong>Average Systolic:</strong>{' '}
              {averageBP.systolic ? averageBP.systolic.toFixed(2) : 'N/A'} mmHg
            </p>
            <p>
              <strong>Average Diastolic:</strong>{' '}
              {averageBP.diastolic ? averageBP.diastolic.toFixed(2) : 'N/A'} mmHg
            </p>
            <div className="h-64 mt-2">
              {bpChartType === 'Line' && <Line data={prepareBPChartData()} options={chartOptions} />}
              {bpChartType === 'Bar' && <Bar data={prepareBPChartData()} options={chartOptions} />}
              {bpChartType === 'Radar' && <Radar data={prepareBPChartData()} options={chartOptions} />}
              {bpChartType === 'PolarArea' && <PolarArea data={prepareBPChartData()} options={chartOptions} />}
            </div>
            <BloodPressureForm onAdd={fetchData} />
          </div>
          {/* Sugar Levels Section */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl">Sugar Levels</h2>
              <div>
                <label htmlFor="sugarChartType" className="mr-2">
                  Chart Type:
                </label>
                <select
                  id="sugarChartType"
                  value={sugarChartType}
                  onChange={(e) => setSugarChartType(e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="Line">Line</option>
                  <option value="Bar">Bar</option>
                  <option value="Doughnut">Doughnut</option>
                  <option value="PolarArea">Polar Area</option>
                </select>
              </div>
            </div>
            <p>
              <strong>Average Sugar Level:</strong>{' '}
              {averageSugar ? averageSugar.toFixed(2) : 'N/A'} mg/dL
            </p>
            <div className="h-64 mt-2">
              {sugarChartType === 'Line' && <Line data={prepareSugarChartData()} options={chartOptions} />}
              {sugarChartType === 'Bar' && <Bar data={prepareSugarChartData()} options={chartOptions} />}
              {sugarChartType === 'Doughnut' && <Doughnut data={prepareSugarChartData()} options={chartOptions} />}
              {sugarChartType === 'PolarArea' && <PolarArea data={prepareSugarChartData()} options={chartOptions} />}
            </div>
            <SugarLevelForm onAdd={fetchData} />
          </div>
        </div>
        {/* Recent Entries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Recent Blood Pressure Entries */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl mb-2">Recent Blood Pressure Entries</h2>
            {bloodPressure.length > 0 ? (
              <ul>
                {bloodPressure.slice(-5).reverse().map((entry) => (
                  <li key={entry._id} className="flex justify-between p-2 border-b">
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                    <span>
                      <strong>Time:</strong> {entry.time === 'Custom' ? entry.customTime : entry.time} <br />
                      <strong>BP:</strong> {entry.systolic}/{entry.diastolic} mmHg <br />
                      {entry.pulse && (
                        <>
                          <strong>Pulse:</strong> {entry.pulse} <br />
                        </>
                      )}
                      <strong>Helper:</strong> {entry.helper || 'N/A'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent blood pressure entries.</p>
            )}
          </div>
          {/* Recent Sugar Level Entries */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl mb-2">Recent Sugar Level Entries</h2>
            {sugarLevels.length > 0 ? (
              <ul>
                {sugarLevels.slice(-5).reverse().map((entry) => (
                  <li key={entry._id} className="flex justify-between p-2 border-b">
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                    <span>
                      <strong>Time:</strong> {entry.time === 'Custom' ? entry.customTime : entry.time} <br />
                      <strong>Level:</strong> {entry.level} mg/dL -{' '}
                      {entry.level < 140 ? (
                        <span className="text-green-500">Good</span>
                      ) : (
                        <span className="text-red-500">High</span>
                      )}{' '}
                      <br />
                      <strong>Measurement Time:</strong> {entry.measurement_time} <br />
                      <strong>Helper:</strong> {entry.helper || 'N/A'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent sugar level entries.</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
