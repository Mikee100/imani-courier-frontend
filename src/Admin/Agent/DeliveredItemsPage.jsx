import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DeliveredItemsPage() {
  const [deliveredParcels, setDeliveredParcels] = useState([]);

  useEffect(() => {
    fetchDeliveredParcels();
  }, []);

  const fetchDeliveredParcels = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/parcels/delivered");
      setDeliveredParcels(response.data);
    } catch (error) {
      console.error("Error fetching delivered parcels:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Delivered Items</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Parcel Number</th>
            <th className="border border-gray-300 p-2">Sender</th>
            <th className="border border-gray-300 p-2">Recipient</th>
            <th className="border border-gray-300 p-2">Destination</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {deliveredParcels.map((parcel) => (
            <tr key={parcel.id} className="text-center">
              <td className="border border-gray-300 p-2">{parcel.parcel_number}</td>
              <td className="border border-gray-300 p-2">{parcel.sender_name}</td>
              <td className="border border-gray-300 p-2">{parcel.recipient_name}</td>
              <td className="border border-gray-300 p-2">{parcel.destination}</td>
              <td className="border border-gray-300 p-2 text-green-600 font-bold">
                {parcel.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
