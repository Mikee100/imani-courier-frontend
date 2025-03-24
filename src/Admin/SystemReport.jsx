import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const SystemReport = () => {
  const [parcels, setParcels] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch parcel and user data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parcelsResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/parcels/report"),
          axios.get("http://localhost:3000/api/users/report"),
        ]);
        setParcels(parcelsResponse.data);
        setUsers(usersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for charts
  const processData = (parcels, users) => {
    // Parcel Status Distribution
    const statusCounts = parcels.reduce((acc, parcel) => {
      acc[parcel.status] = (acc[parcel.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));

    // Parcel Volume Over Time
    const volumeOverTime = parcels.reduce((acc, parcel) => {
      const date = new Date(parcel.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const volumeData = Object.keys(volumeOverTime).map((date) => ({
      date,
      parcels: volumeOverTime[date],
    }));

    // Revenue by Category
    const revenueByCategory = parcels.reduce((acc, parcel) => {
      acc[parcel.category] = (acc[parcel.category] || 0) + (parcel.cost || 0);
      return acc;
    }, {});

    const revenueData = Object.keys(revenueByCategory).map((category) => ({
      category,
      revenue: revenueByCategory[category],
    }));

    // Parcel Weight Distribution
    const weightData = parcels.map((parcel) => ({
      weight: parcel.parcel_weight,
    }));

    // User Gender Distribution
    const genderCounts = users.reduce((acc, user) => {
      acc[user.gender] = (acc[user.gender] || 0) + 1;
      return acc;
    }, {});

    const genderData = Object.keys(genderCounts).map((gender) => ({
      name: gender,
      value: genderCounts[gender],
    }));

    // User Role Distribution
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const roleData = Object.keys(roleCounts).map((role) => ({
      name: role,
      value: roleCounts[role],
    }));

    return { statusData, volumeData, revenueData, weightData, genderData, roleData };
  };

  const { statusData, volumeData, revenueData, weightData, genderData, roleData } =
    processData(parcels, users);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">System Report</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Parcels</h3>
          <p className="text-2xl">{parcels.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl">{users.length}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
  <h3 className="text-lg font-semibold">Total Revenue</h3>
  <p className="text-2xl">
    KES{" "}
    {parcels
      .reduce((acc, parcel) => {
        const cost = parseFloat(parcel.cost); // Ensure cost is a number
        if (isNaN(cost)) {
          console.warn("Invalid cost value:", parcel.cost); // Log invalid values
          return acc;
        }
        return acc + cost;
      }, 0)
      .toFixed(2)} {/* Format as currency */}
  </p>
</div>
      </div>

      {/* Parcel Status Distribution */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Parcel Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Parcel Volume Over Time */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Parcel Volume Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="parcels" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by Category */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Revenue by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Gender Distribution */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Gender Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genderData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* User Role Distribution */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Role Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={roleData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {roleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SystemReport;