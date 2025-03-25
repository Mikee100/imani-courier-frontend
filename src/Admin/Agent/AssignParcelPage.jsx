import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AssignParcelPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch drivers
  useEffect(() => {
    axios.get("http://localhost:3000/api/drivers")
      .then((res) => setDrivers(res.data))
      .catch((err) => {
        console.error("Error fetching drivers:", err);
        toast.error("Failed to load drivers");
      });
  }, []);

  // Fetch parcels with status "Registered"
  useEffect(() => {
    axios.get("http://localhost:3000/api/parcels?status=Registered")
      .then((res) => setParcels(res.data))
      .catch((err) => {
        console.error("Error fetching parcels:", err);
        toast.error("Failed to load parcels");
      });
  }, []);

  const handleDriverChange = (parcelId, driverId) => {
    setSelectedDrivers((prev) => ({
      ...prev,
      [parcelId]: driverId,
    }));
  };

  const handleAssignParcel = async (parcelId) => {
    const driverId = selectedDrivers[parcelId];

    if (!driverId) {
      toast.warning("Please select a driver for this parcel");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Assign the parcel to driver
      await axios.post("http://localhost:3000/api/assign-parcel", {
        driver_id: driverId,
        parcel_id: parcelId,
      });

      // 2. Update the status to "In Transit" and trigger email notification
      const statusResponse = await axios.put(
        `http://localhost:3000/api/parcels/${parcelId}/update-my-status`,
        { status: "In Transit" }
      );

      if (statusResponse.data.success) {
        toast.success(
          `Parcel assigned successfully. ${
            statusResponse.data.data.email_sent 
              ? "Recipient has been notified." 
              : "Could not send notification email."
          }`
        );
        
        // Refresh the parcels list
        setParcels((prev) => prev.filter((parcel) => parcel.id !== parcelId));
      } else {
        throw new Error(statusResponse.data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error assigning parcel:", error);
      toast.error(error.response?.data?.error || "Failed to assign parcel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Assign Parcels to Drivers</h2>

      {parcels.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No registered parcels available for assignment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Parcel ID</th>
                <th className="p-3 border-b">Destination</th>
                <th className="p-3 border-b">Assign Driver</th>
                <th className="p-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{parcel.parcel_number}</td>
                  <td className="p-3 border-b">{parcel.destination}</td>
                  <td className="p-3 border-b">
                    <select
                      value={selectedDrivers[parcel.id] || ""}
                      onChange={(e) => handleDriverChange(parcel.id, e.target.value)}
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      <option value="">Select Driver</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.town})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => handleAssignParcel(parcel.id)}
                      disabled={isLoading || !selectedDrivers[parcel.id]}
                      className={`px-4 py-2 rounded text-white ${
                        isLoading || !selectedDrivers[parcel.id]
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isLoading ? "Processing..." : "Assign"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignParcelPage;