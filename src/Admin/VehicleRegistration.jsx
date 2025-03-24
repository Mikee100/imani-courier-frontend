import React, { useState, useEffect } from "react";
import axios from "axios";

const VehicleRegistration = () => {
  const [vehicle, setVehicle] = useState({ plate_number: "", model: "", town: "" });
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/vehicles", vehicle);
      setMessage(response.data.message);
      fetchVehicles(); // Refresh vehicle list after adding a new one
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding vehicle");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="plate_number"
          placeholder="Registration Number"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />
        <input
          name="model"
          placeholder="Model"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />
        <input
          name="town"
          placeholder="Town"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Add Vehicle
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}

      {/* Vehicle List */}
      <h2 className="text-xl font-semibold mt-6">Registered Vehicles</h2>
      <ul className="mt-4 border p-4">
        {vehicles.length > 0 ? (
          vehicles.map((v, index) => (
            <li key={index} className="border-b p-2">
              <strong>{v.registration_number}</strong> - {v.type} ({v.town})
            </li>
          ))
        ) : (
          <p>No vehicles registered yet.</p>
        )}
      </ul>
    </div>
  );
};

export default VehicleRegistration;
