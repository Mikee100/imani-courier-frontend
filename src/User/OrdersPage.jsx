import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../General/AuthContext";
import axios from "axios";
import { Loader2, XCircle, CheckCircle } from "lucide-react";

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState({});

  // Fetch Orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/orders?email=${user.email}`);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);
  console.log(orders);

  // Fetch Order Status
  useEffect(() => {
    if (!user) return;

    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/orders/status`, {
          params: { email: user.email },
        });
        const statusMap = response.data.reduce((acc, order) => {
          acc[order.parcel_number] = order.status;
          return acc;
        }, {});
        setStatuses(statusMap);
      } catch (err) {
        console.error("Error fetching order status:", err);
      }
    };

    fetchOrderStatus();
  }, [user]);

  // Status Steps
  const statusSteps = ["Registered", "Released", "In Transit", "Out for Delivery", "Delivered"];
  const getStatusStep = (status) => statusSteps.indexOf(status);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">📦 My Orders</h1>

      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin text-gray-600 w-8 h-8" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <p className="text-gray-500 text-center mt-6">You have no orders yet.</p>
      )}

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div key={order.id || index} className="p-5 rounded-lg shadow-md bg-white">
            <p className="text-lg font-semibold text-gray-800">📦 Parcel No: {order.parcel_number || "N/A"}</p>
            
            <div className="grid sm:grid-cols-2 gap-3 mt-2 text-gray-700">
              <p><strong>Sender:</strong> {order.sender_name || "N/A"}</p>
              <p><strong>Receiver:</strong> {order.recipient_name || "N/A"}</p>
              <p><strong>Pickup:</strong> {order.pickup_location || "N/A"}</p>
              <p><strong>Destination:</strong> {order.destination || "N/A"}</p>
              <p><strong>Category:</strong> {order.category || "N/A"}</p>
              <p><strong>Date:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : "Unknown"}</p>
            </div>

            {/* Order Progress */}
            <div className="mt-6">
  <p className="font-semibold text-lg text-gray-800 mb-4">Order Progress</p>
  <div className="flex items-center justify-between relative">
    {statusSteps.map((step, stepIndex) => {
      const isActive = stepIndex <= getStatusStep(statuses[order.parcel_number] || order.status);
      const isCompleted = stepIndex < getStatusStep(statuses[order.parcel_number] || order.status);

      return (
        <div
          key={step}
          className="relative flex flex-col items-center w-full transition-all duration-300"
        >
          {/* Lifeline Connector */}
          {stepIndex > 0 && (
            <div
              className={`absolute top-3 left-0 right-0 h-1.5 ${
                isActive ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gray-200"
              }`}
            ></div>
          )}

          {/* Status Circle */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              isCompleted
                ? "bg-green-500 border-green-500"
                : isActive
                ? "bg-white border-green-500"
                : "bg-white border-gray-300"
            } transition-all duration-300 hover:scale-110 cursor-pointer`}
            title={`Status: ${step}`} // Tooltip
          >
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <div
                className={`w-3 h-3 rounded-full ${
                  isActive ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>

          {/* Step Label */}
          <p
            className={`text-sm mt-2 text-center ${
              isActive ? "text-green-600 font-semibold" : "text-gray-500"
            }`}
          >
            {step}
          </p>
        </div>
      );
    })}
  </div>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}
