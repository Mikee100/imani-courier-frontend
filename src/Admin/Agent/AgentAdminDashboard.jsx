import React from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { FaBars, FaBox, FaClipboardCheck, FaTruck, FaSignOutAlt } from "react-icons/fa";

export default function AgentAdminDashboard() {
  const location = useLocation();
    // Redirect to "register-parcel" if the current path is the base path
    if (location.pathname === "/admin/agent/dashboard" || location.pathname === "/admin/agent/dashboard") {
      return <Navigate to="register-parcel" replace />;
    }

  return (
    <div className="flex mt-18 h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-5">
        <h2 className="text-xl font-bold text-gray-700 mb-5">Agent Admin</h2>
        <ul className="space-y-4">
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
              location.pathname.includes("register-parcel") ? "bg-gray-300" : ""
            }`}
          >
            <Link to="register-parcel" className="flex items-center w-full">
              <FaBox className="mr-3" /> Register Parcel
            </Link>
          </li>
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
              location.pathname.includes("track-parcel") ? "bg-gray-300" : ""
            }`}
          >
            <Link to="track-parcel" className="flex items-center w-full">
              <FaClipboardCheck className="mr-3" /> Track Parcel
            </Link>
          </li>
         
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
              location.pathname.includes("confirm-delivery") ? "bg-gray-300" : ""
            }`}
          >
            <Link to="confirm-delivery" className="flex items-center w-full">
              <FaTruck className="mr-3" /> Confirm Delivery
            </Link>
          </li>
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
              location.pathname.includes("assign-parcel") ? "bg-gray-300" : ""
            }`}
          >
            <Link to="assign-parcel" className="flex items-center w-full">
              <FaTruck className="mr-3" /> Assigning Parcel
            </Link>
          </li>
          <li className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-red-400 text-red-600 mt-10">
            <FaSignOutAlt className="mr-3" /> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white p-6 shadow-md rounded-lg">
          {/* Render nested routes here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}