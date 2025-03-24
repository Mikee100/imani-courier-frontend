import React,{useContext} from "react";
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { FaBars, FaBox, FaClipboardCheck, FaTruck, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../General/AuthContext";

export default function AdminDashboard() {
  const location = useLocation();
  // Redirect to "register-parcel" if the current path is the base path
  if (location.pathname === "/admin/dashboard" || location.pathname === "/admin/dashboard") {
    return <Navigate to="daily-report" replace />;
  }
  
 const { logout } = useContext(AuthContext);

 const navigate = useNavigate();
  const handleLogout = () => {

    sessionStorage.removeItem("UserEmail");
    logout();

    navigate("/login");

  };

  return (
    <div className="flex mt-18 h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-5">
        <h2 className="text-xl font-bold text-gray-700 mb-5">Admin</h2>
        <ul className="space-y-4">
        <li
                      className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
                        location.pathname.includes("daily-report") ? "bg-gray-300" : ""
                      }`}
                    >
                      <Link to="daily-report" className="flex items-center w-full">
                        <FaClipboardCheck className="mr-3" /> Daily Report
                      </Link>
                    </li>
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
              location.pathname.includes("vehicle-registration") ? "bg-gray-300" : ""
            }`}
          >
            <Link to="vehicle-registration" className="flex items-center w-full">
              <FaBox className="mr-3" /> Vehicle Registration
            </Link>
          </li>
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
              location.pathname.includes("driver-registration") ? "bg-gray-300" : ""
            }`}
          >
            <Link to="driver-registration" className="flex items-center w-full">
              <FaClipboardCheck className="mr-3" /> Driver Registration
            </Link>
          </li>
          <li
                      className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
                        location.pathname.includes("system-report") ? "bg-gray-300" : ""
                      }`}
                    >
                      <Link to="system-report" className="flex items-center w-full">
                        <FaClipboardCheck className="mr-3" /> System Report
                      </Link>
                    </li>

          
          <li
                      className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
                        location.pathname.includes("audit") ? "bg-gray-300" : ""
                      }`}
                    >
                      <Link to="audit" className="flex items-center w-full">
                        <FaClipboardCheck className="mr-3" /> Audit
                      </Link>
                    </li>
        
          <li  onClick={handleLogout} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-red-400 text-red-600 mt-10">
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