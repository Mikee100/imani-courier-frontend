import { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaImage } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    phone: "",
    idNumber: "",
    email: "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
      setPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });
    formDataObj.append("role", "user");

    try {
      const res = await axios.post("http://localhost:3000/api/register", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border">
            <FaUser className="text-gray-400 mr-3" />
            <input type="text" name="name" placeholder="Full Name" className="bg-transparent outline-none w-full text-gray-700" onChange={handleChange} required />
          </div>

          {/* Gender */}
          <select name="gender" className="w-full p-3 bg-gray-50 border rounded-lg outline-none text-gray-700" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Phone */}
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border">
            <FaPhone className="text-gray-400 mr-3" />
            <input type="text" name="phone" placeholder="Phone Number" className="bg-transparent outline-none w-full text-gray-700" onChange={handleChange} required />
          </div>

          {/* ID Number */}
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border">
            <FaIdCard className="text-gray-400 mr-3" />
            <input type="text" name="idNumber" placeholder="ID Number" className="bg-transparent outline-none w-full text-gray-700" onChange={handleChange} required />
          </div>
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border">
            <FaIdCard className="text-gray-400 mr-3" />
            <input type="text" name="age" placeholder="Age" className="bg-transparent outline-none w-full text-gray-700" onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input type="email" name="email" placeholder="Email" className="bg-transparent outline-none w-full text-gray-700" onChange={handleChange} required />
          </div>

          {/* Password */}
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border">
            <FaLock className="text-gray-400 mr-3" />
            <input type="password" name="password" placeholder="Password" className="bg-transparent outline-none w-full text-gray-700" onChange={handleChange} required />
          </div>

          {/* File Upload */}
          <div className="bg-gray-50 border rounded-lg px-4 py-2 flex flex-col items-center">
            <label htmlFor="fileInput" className="cursor-pointer text-gray-700 flex items-center space-x-2">
              <FaImage className="text-gray-400" />
              <span>Upload Profile Image</span>
            </label>
            <input type="file" name="image" className="hidden" id="fileInput" onChange={handleChange} required />
          </div>

          {/* Image Preview */}
          {preview && <img src={preview} alt="Preview" className="w-20 h-20 rounded-full mx-auto border border-gray-300 mt-3" />}

          {/* Submit Button */}
          <button type="submit" className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition-all text-white py-3 rounded-lg font-semibold shadow-md">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
