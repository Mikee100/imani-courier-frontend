import { useState } from "react";
import axios from "axios";

const AdminRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // Main Admin, Agent Admin, Delivery Agent
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/register", formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Registration</h2>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded" onChange={handleChange} required />
          <select name="role" className="w-full p-2 border rounded" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="main_admin">Main Admin</option>
            <option value="agent_admin">Agent Admin</option>
            <option value="delivery_agent">Delivery Agent</option>
          </select>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistration;