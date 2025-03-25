import React from "react";
import { FaTimes, FaBox, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWeightHanging, FaTag, FaMoneyBillWave, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";

const ParcelModal = ({ parcel, onClose }) => {
  if (!parcel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-bold">Parcel Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Parcel Information Section */}
          <div className="space-y-3">
            <h4 className="flex items-center text-lg font-semibold">
              <FaBox className="mr-2 text-blue-500" />
              Parcel Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Parcel Number" value={parcel.parcel_number} />
              <DetailItem 
                label="Status" 
                value={parcel.status} 
                status={parcel.status} 
              />
              <DetailItem label="Category" value={parcel.category} />
              <DetailItem label="Weight" value={`${parcel.parcel_weight} kg`} />
              <DetailItem label="Cost" value={`KSh ${parcel.cost?.toFixed(2) || 'N/A'}`} />
            </div>
          </div>

          {/* Sender Information Section */}
          <div className="space-y-3">
            <h4 className="flex items-center text-lg font-semibold">
              <FaUser className="mr-2 text-green-500" />
              Sender Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Name" value={parcel.sender_name} />
              <DetailItem label="Phone" value={parcel.sender_phone} />
              <DetailItem label="Email" value={parcel.sender_email || 'N/A'} />
              <DetailItem label="Pickup Location" value={parcel.pickup_location} />
            </div>
          </div>

          {/* Recipient Information Section */}
          <div className="space-y-3">
            <h4 className="flex items-center text-lg font-semibold">
              <FaUser className="mr-2 text-purple-500" />
              Recipient Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Name" value={parcel.recipient_name} />
              <DetailItem label="Phone" value={parcel.recipient_phone} />
              <DetailItem label="Destination" value={parcel.destination} />
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-3">
            <h4 className="flex items-center text-lg font-semibold">
              <FaCalendarAlt className="mr-2 text-yellow-500" />
              Timeline
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <DetailItem label="Created At" value={new Date(parcel.created_at).toLocaleString()} />
              <DetailItem label="Last Updated" value={new Date(parcel.updated_at).toLocaleString()} />
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, status }) => {
  const statusClasses = {
    'Registered': 'bg-blue-100 text-blue-800',
    'Released': 'bg-purple-100 text-purple-800',
    'In Transit': 'bg-yellow-100 text-yellow-800',
    'Delivered': 'bg-green-100 text-green-800'
  };

  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {status ? (
        <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status]}`}>
          {value}
        </span>
      ) : (
        <p className="font-medium">{value || 'N/A'}</p>
      )}
    </div>
  );
};

export default ParcelModal;