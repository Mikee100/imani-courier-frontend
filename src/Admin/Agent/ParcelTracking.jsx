import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ParcelDeliveries.css"; // Import the CSS file for styling

const ParcelTracking = () => {
  const [parcelDeliveries, setParcelDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllParcelDeliveries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/parcels/track");
        setParcelDeliveries(response.data);
      } catch (error) {
        console.error("Error fetching parcel deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllParcelDeliveries();
  }, []);

  const handleReleaseOrder = async (parcelId) => {
    try {
      await axios.put(`http://localhost:3000/api/parcels/release/${parcelId}`);
      // Update state locally to reflect the change
      setParcelDeliveries((prevDeliveries) =>
        prevDeliveries.map((parcel) =>
          parcel.id === parcelId ? { ...parcel, status: "Released" } : parcel
        )
      );
    } catch (error) {
      console.error("Error releasing order:", error);
    }
  };

  if (loading) return <p className="loading">Loading all parcel deliveries...</p>;

  return (
    <div className="parcel-container">
      <h2>All Parcel Deliveries</h2>
      <div className="parcel-table">
        {parcelDeliveries.length === 0 ? (
          <p className="no-parcels">No parcels found.</p>
        ) : (
          parcelDeliveries.map((parcel) => (
            <div className="parcel-card" key={parcel.id}>
              <div className="parcel-info">
              <p><strong>Parcel ID:</strong> {parcel.id}</p>
                <p><strong>Parcel Number:</strong> {parcel.parcel_number}</p>
                <p><strong>Status:</strong> {parcel.status}</p>
                <p><strong>Updated:</strong> {new Date(parcel.created_at).toLocaleString()}</p>
              </div>
              {/* Tracking Progress Bar */}
              <div className="progress-bar">
                <div className={`progress-step ${["Registered", "Released", "In Transit", "Delivered"].includes(parcel.status) ? "active" : ""}`}>Registered</div>
                <div className={`progress-step ${["Released", "In Transit", "Delivered"].includes(parcel.status) ? "active" : ""}`}>Released</div>
                <div className={`progress-step ${["In Transit", "Delivered"].includes(parcel.status) ? "active" : ""}`}>In Transit</div>
                <div className={`progress-step ${["Delivered"].includes(parcel.status) ? "active" : ""}`}>Arrived</div>
              </div>

              {/* Release Order Button (Only if status is Registered) */}
              {parcel.status === "Registered" && (
                <button className="release-btn" onClick={() => handleReleaseOrder(parcel.id)}>
                  Release Order
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParcelTracking;
