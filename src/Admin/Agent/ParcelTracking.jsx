import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ParcelDeliveries.css"; // Import the CSS file for styling
import { FaArrowRight, FaTimes, FaBox, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWeightHanging, FaTag, FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";

const ParcelTracking = () => {
  const [parcelDeliveries, setParcelDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const fetchParcelDetails = async (parcelId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/parcels/${parcelId}`);
      setSelectedParcel(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching parcel details:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedParcel(null);
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
              <button 
                className="flex items-center justify-center w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                onClick={() => fetchParcelDetails(parcel.id)}
              >
                View <FaArrowRight className="ml-2" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for displaying parcel details */}
      {showModal && selectedParcel && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Parcel Details</h3>
              <button onClick={closeModal} className="modal-close-btn">
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4><FaBox className="icon" /> Parcel Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Parcel Number:</span>
                  <span className="detail-value">{selectedParcel.parcel_number}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value status-${selectedParcel.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedParcel.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{selectedParcel.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Weight:</span>
                  <span className="detail-value">{selectedParcel.parcel_weight} kg</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Cost:</span>
                  <span className="detail-value">KSh {selectedParcel.cost || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4><FaUser className="icon" /> Sender Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedParcel.sender_name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedParcel.sender_phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedParcel.sender_email || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Pickup Location:</span>
                  <span className="detail-value">{selectedParcel.pickup_location}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4><FaUser className="icon" /> Recipient Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedParcel.recipient_name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedParcel.recipient_phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Destination:</span>
                  <span className="detail-value">{selectedParcel.destination}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4><FaInfoCircle className="icon" /> Additional Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Created At:</span>
                  <span className="detail-value">{new Date(selectedParcel.created_at).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{new Date(selectedParcel.updated_at).toLocaleString()}</span>
                </div>
                {selectedParcel.mpesa_transaction_id && (
                  <div className="detail-row">
                    <span className="detail-label">MPESA Transaction ID:</span>
                    <span className="detail-value">{selectedParcel.mpesa_transaction_id}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="modal-close-button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelTracking;