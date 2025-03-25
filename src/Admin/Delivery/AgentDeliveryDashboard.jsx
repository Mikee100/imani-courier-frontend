import React, { useState,useContext } from "react";
import { FaBars, FaBox, FaClipboardCheck, FaTruck, FaSignOutAlt } from "react-icons/fa";
import ReleasedItemsPage from "./ReleasedItemsPage";
import { AuthContext } from "../../General/AuthContext";
import { useNavigate } from "react-router";


export default function AgentDeliveryDashboard() {
  const [activeSection, setActiveSection] = useState("releaseditems");
 const { logout } = useContext(AuthContext);

 const handleLogout = () => {
  const navigate = useNavigate();
  sessionStorage.removeItem("UserEmail");
  logout();

  navigate("/login");

};

  return (
    <div className="flex mt-18 h-screen bg-gray-100">
      
      <div className="w-64 bg-white shadow-md p-5">
        <h2 className="text-xl font-bold text-gray-700 mb-5">Delivery Agent </h2>
        <ul className="space-y-4">
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
              activeSection === "releaseditems" ? "bg-gray-300" : ""
            }`}
            onClick={() => setActiveSection("releaseditems")}
          >
            <FaBox className="mr-3" /> Released Items
          </li>
        
          <li onClick={handleLogout} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-red-400 text-red-600 mt-10">
            <FaSignOutAlt className="mr-3" /> Logout
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">
        
        
        
        <div className="bg-white p-6 shadow-md rounded-lg">
          {activeSection === "releaseditems" && <ReleasedItemsPage />}
       
        </div>
      </div>
    </div>
  );
}