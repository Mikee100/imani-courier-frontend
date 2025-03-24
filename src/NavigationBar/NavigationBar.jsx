import React, { useContext, useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../General/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NavigationBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]); // State to store user data as an array
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = sessionStorage.getItem("UserEmail");
        console.log("User Email from sessionStorage:", userEmail); // Debugging

        if (!userEmail) {
          throw new Error("User email not found in sessionStorage.");
        }

        const response = await axios.get(`http://localhost:3000/api/users/email/${userEmail}`);
        console.log("API Response:", response.data); // Debugging

        // Set the response data directly (assuming it's an array)
        setUsers(response.data); // No need to wrap in another array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
  
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Navigate to Orders Page
  const goToOrders = () => {
    navigate("/orders");
    setIsSidebarOpen(false); // Close sidebar after navigation
  };

  // Navigate to Login Page
  const goToLogin = () => {
    navigate("/login");
    setIsSidebarOpen(false); // Close sidebar after navigation
  };

  // Navigate to Home Page
  const backHome = () => {
    navigate("/");
    setIsSidebarOpen(false); // Close sidebar after navigation
  };

  // Navigate to User Profile Page
  const goToUserProfile = () => {
    navigate("/userprofile");
    setIsSidebarOpen(false); // Close sidebar after navigation
  };

  // Handle Logout
  const handleLogout = () => {
    // Clear the users state
    setUsers([]);

    // Remove the user's email from sessionStorage
    sessionStorage.removeItem("UserEmail");

    // Call the logout function from AuthContext
    logout();

    // Navigate to the login page
    navigate("/login");

    // Close the sidebar
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left Section (Bar Icon + Logo) */}
          <div className="flex items-center gap-4">
         
  <button onClick={toggleSidebar} className="text-2xl text-gray-700">
    <FaBars />
  </button>

            <div onClick={backHome} className="text-2xl font-bold cursor-pointer text-blue-600">
              Imani Courier
            </div>
          </div>

          {/* User Profile and Orders Button (Right Side) */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : users.length > 0 ? (
              users.map((user) => {
                console.log("User Data in Map:", user); // Debugging
                return (
                  <React.Fragment key={user.email}>
                    <img
                      src={`http://localhost:3000${user.image}` || "/default-avatar.png"} // Use user's image or fallback
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full cursor-pointer"
                      onClick={goToUserProfile}
                    />
                    <span className="text-gray-700">{user.name}</span>
                   
                  </React.Fragment>
                );
              })
            ) : (
              <button
                onClick={goToLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation (Left Side) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button onClick={toggleSidebar} className="text-2xl absolute top-4 right-4">
            <FaTimes />
          </button>

          {/* Sidebar Content */}
          <div className="mt-8 flex flex-col gap-6 text-lg">
            <a href="/" className="text-gray-700 hover:text-blue-600" onClick={backHome}>
              Home
            </a>
            <button
              onClick={goToOrders}
              className="text-gray-700 hover:text-blue-600 text-left"
            >
              My Orders
            </button>
            {users.length > 0 && (
              <>
                <button
                  onClick={goToUserProfile}
                  className="text-gray-700 hover:text-blue-600 text-left"
                >
                  Profile
                </button>
                <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Logout
                    </button>
              </>
            )}
            {users.length === 0 && (
              <button
                onClick={goToLogin}
                className="text-gray-700 hover:text-blue-600 text-left"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-20" onClick={toggleSidebar} />
      )}
    </>
  );
}