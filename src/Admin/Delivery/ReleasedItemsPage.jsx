import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../General/AuthContext";
import ParcelModal from "../ParcelModal";


export default function ReleasedItemsPage() {
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.role === "driver" && user.email) {
      fetchAssignedParcels();
    }
  }, [user]);

  const fetchAssignedParcels = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/parcels/assigned-to-driver", {
        params: { driverEmail: user.email }
      });
      setParcels(response.data);
    } catch (error) {
      console.error("Error fetching assigned parcels:", error);
    }
  };

  const updateParcelStatus = async (parcelId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/parcels/${parcelId}/update-status`,
        { status: newStatus }
      );
      
      if (response.data.success) {

        fetchAssignedParcels(); // Refresh the list
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(`Error updating parcel status to ${newStatus}:`, error);
   
    }
  };
  const handleParcelClick = (parcel) => {
    setSelectedParcel(parcel);
    setShowModal(true);
  };

  if (!user || user.role !== "driver") {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You must be a driver to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Assigned Shipments</h2>
      {parcels.length === 0 ? (
        <p className="text-gray-500">No parcels currently assigned to you.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Parcel Number</th>
              <th className="border border-gray-300 p-2">Sender</th>
              <th className="border border-gray-300 p-2">Recipient</th>
              <th className="border border-gray-300 p-2">Destination</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr 
                key={parcel.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleParcelClick(parcel)}
              >
                <td className="border border-gray-300 p-2">{parcel.parcel_number}</td>
                <td className="border border-gray-300 p-2">{parcel.sender_name}</td>
                <td className="border border-gray-300 p-2">{parcel.recipient_name}</td>
                <td className="border border-gray-300 p-2">{parcel.destination}</td>
                <td className="border border-gray-300 p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    parcel.status === 'Released' ? 'bg-blue-100 text-blue-800' :
                    parcel.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {parcel.status}
                  </span>
                </td>
                <td className="border border-gray-300 p-2 space-x-2" onClick={(e) => e.stopPropagation()}>
                  {parcel.status === "Released" && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      onClick={() => updateParcelStatus(parcel.id, "In Transit")}
                    >
                      Start Delivery
                    </button>
                  )}
                  {parcel.status === "In Transit" && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      onClick={() => updateParcelStatus(parcel.id, "Delivered")}
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for displaying parcel details */}
      {showModal && (
        <ParcelModal 
          parcel={selectedParcel} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}