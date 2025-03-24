import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaSpinner } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    gender: "",
    age: "",
    phone: "",
    id_number: "",
    email: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = sessionStorage.getItem("UserEmail");
        if (!userEmail) {
          throw new Error("User email not found in sessionStorage.");
        }

        const response = await axios.get(`http://localhost:3000/api/users/email/${userEmail}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">User Profile</h1>

{user.map((myuser) => ( 
<div>

<div className="flex flex-col items-center mb-6">
<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
  <img
    src={`http://localhost:3000${myuser.image}` || "https://via.placeholder.com/150"}
    alt="Profile"
    className="w-full h-full object-cover"
  />
</div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center bg-gray-50 p-4 rounded-lg">
          <FaUser className="text-gray-600 mr-3 text-xl" />
          <span className="font-semibold">Name:</span>
          <span className="ml-3 text-gray-700">{myuser.name}</span>
        </div>

        <div className="flex items-center bg-gray-50 p-4 rounded-lg">
          <FaEnvelope className="text-gray-600 mr-3 text-xl" />
          <span className="font-semibold">Email:</span>
          <span className="ml-3 text-gray-700">{myuser.email}</span>
        </div>

        <div className="flex items-center bg-gray-50 p-4 rounded-lg">
          <FaPhone className="text-gray-600 mr-3 text-xl" />
          <span className="font-semibold">Phone:</span>
          <span className="ml-3 text-gray-700">{myuser.phone}</span>
        </div>

        <div className="flex items-center bg-gray-50 p-4 rounded-lg">
          <FaIdCard className="text-gray-600 mr-3 text-xl" />
          <span className="font-semibold">ID Number:</span>
          <span className="ml-3 text-gray-700">{myuser.id_number}</span>
        </div>

        <div className="flex items-center bg-gray-50 p-4 rounded-lg">
          <span className="font-semibold">Gender:</span>
          <span className="ml-3 text-gray-700">{myuser.gender}</span>
        </div>

        <div className="flex items-center bg-gray-50 p-4 rounded-lg">
          <span className="font-semibold">Age:</span>
          <span className="ml-3 text-gray-700">{myuser.age}</span>
        </div>
      </div>
  </div>

))}
     
    </div>
  );
};

export default UserProfile;