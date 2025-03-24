import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignParcelPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [message, setMessage] = useState("");

  // Fetch drivers
  useEffect(() => {
    axios.get("http://localhost:3000/api/drivers")
      .then((res) => setDrivers(res.data))
      .catch((err) => console.error("Error fetching drivers:", err));
  }, []);

    console.log("drivers", drivers);

  // Fetch parcels with status "Registered"
  useEffect(() => {
    axios.get("http://localhost:3000/api/parcels?status=Registered")
      .then((res) => setParcels(res.data))
      .catch((err) => console.error("Error fetching parcels:", err));
  }, []);

  // Handle driver selection for each parcel
  const handleDriverChange = (parcelId, driverId) => {
    setSelectedDrivers((prev) => ({
      ...prev,
      [parcelId]: driverId,
    }));
  };

  // Handle assignment
  const handleAssignParcel = async (parcelId) => {
    const driverId = selectedDrivers[parcelId];

    if (!driverId) {
      setMessage("Please select a driver for each parcel.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/assign-parcel", {
        driver_id: driverId,
        parcel_id: parcelId,
      });

      // Update the status to "In Transit"
      await axios.put(`http://localhost:3000/api/parcels/${parcelId}/update-status`, {
        status: "In Transit",
      });

      setMessage(response.data.message);
      
      // Refresh the parcels list to remove assigned ones
      setParcels((prev) => prev.filter((parcel) => parcel.id !== parcelId));
    } catch (error) {
      setMessage("Error assigning parcel.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Assign Parcels to Drivers</h2>

      {parcels.length === 0 ? (
        <p className="text-gray-500">No registered parcels available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Parcel ID</th>
              <th className="border p-2">Destination</th>
              <th className="border p-2">Assign Driver</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel.id} className="border">
                <td className="border p-2">{parcel.parcel_number}</td>
                <td className="border p-2">{parcel.destination}</td>
                <td className="border p-2">
                  <select
                    value={selectedDrivers[parcel.id] || ""}
                    onChange={(e) => handleDriverChange(parcel.id, e.target.value)}
                    className="border p-1 w-full"
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.town}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleAssignParcel(parcel.id)}
                    className="bg-blue-600 text-white px-4 py-1"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default AssignParcelPage;
