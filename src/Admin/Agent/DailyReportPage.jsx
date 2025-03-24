import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DailyReportPage() {
  const [report, setReport] = useState({});
  const [parcels, setParcels] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchDailyReport(selectedDate);
  }, [selectedDate]);

  const fetchDailyReport = async (date) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/reports/daily?date=${date}`);
      setReport(response.data.summary);
      setParcels(response.data.parcels);
    } catch (error) {
      console.error("Error fetching daily report:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Daily Parcel Report</h2>

      {/* Date Picker */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="font-bold">Registered Parcels</h3>
          <p className="text-xl">{report?.registered_parcels || 0}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="font-bold">In Transit</h3>
          <p className="text-xl">{report?.in_transit || 0}</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="font-bold">Delivered</h3>
          <p className="text-xl">{report?.delivered || 0}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="font-bold">Total Processed</h3>
          <p className="text-xl">{report?.total_processed || 0}</p>
        </div>
      </div>

      {/* Parcel Details Table */}
      <h3 className="text-xl font-semibold mb-3">Parcel Details</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Parcel ID</th>
              <th className="p-3 border">Sender</th>
              <th className="p-3 border">Recipient</th>
              <th className="p-3 border">Destination</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Registered On</th>
              <th className="p-3 border">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {parcels.length > 0 ? (
              parcels.map((parcel) => (
                <tr key={parcel.id} className="text-center border-b">
                  <td className="p-3 border">{parcel.id}</td>
                  <td className="p-3 border">{parcel.sender_name}</td>
                  <td className="p-3 border">{parcel.recipient_name}</td>
                  <td className="p-3 border">{parcel.destination}</td>
                  <td className={`p-3 border ${getStatusColor(parcel.status)}`}>{parcel.status}</td>
                  <td className="p-3 border">{new Date(parcel.created_at).toLocaleString()}</td>
                  <td className="p-3 border">{new Date(parcel.updated_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">No parcels found for this date.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Function to add color to status
const getStatusColor = (status) => {
  switch (status) {
    case "Registered":
      return "bg-blue-200";
    case "In Transit":
      return "bg-yellow-200";
    case "Delivered":
      return "bg-green-200";
    case "Out for Delivery":
      return "bg-purple-200";
    default:
      return "bg-gray-200";
  }
};
