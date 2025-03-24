import React, { useState, useEffect } from "react";
import axios from "axios";

const DriverRegistration = () => {
  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    town: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [assignments, setAssignments] = useState({});

  // Fetch drivers
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/drivers");
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  // Fetch available vehicles
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/vehicles")
      .then((res) => setVehicles(res.data))
      .catch((err) => console.error("Error fetching vehicles:", err));
  }, []);

  // Handle driver form input changes
  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  // Handle driver registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add role as 'driver' to the driver object
      const driverData = { ...driver, role: "driver" };
      await axios.post("http://localhost:3000/api/drivers", driverData);
      setMessage("Driver added successfully");
      fetchDrivers(); // Refresh the driver list
    } catch (error) {
      setMessage("Error adding driver");
    }
  };

  // Handle assigning a driver to a vehicle
  const handleAssignVehicle = async (driverId) => {
    const vehicleId = assignments[driverId];

    if (!vehicleId) {
      setMessage("Please select a vehicle.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/assign-vehicle", {
        driver_id: driverId,
        vehicle_id: vehicleId,
      });

      setMessage("Driver assigned to vehicle successfully");
    } catch (error) {
      setMessage("Error assigning vehicle.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Add Driver</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Driver Name"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
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
        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Add Driver
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}

      <h2 className="text-xl font-semibold mt-6">Registered Drivers</h2>
      {drivers.length === 0 ? (
        <p className="text-gray-500">No drivers available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Town</th>
              <th className="border p-2">Assign Vehicle</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="border">
                <td className="border p-2">{driver.name}</td>
                <td className="border p-2">{driver.phone}</td>
                <td className="border p-2">{driver.town}</td>
                <td className="border p-2">
                  <select
                    value={assignments[driver.id] || ""}
                    onChange={(e) =>
                      setAssignments({ ...assignments, [driver.id]: e.target.value })
                    }
                    className="border p-1 w-full"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.registration_number} - {vehicle.type}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleAssignVehicle(driver.id)}
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
    </div>
  );
};

export default DriverRegistration;