import React from 'react';

const Modal = ({ showModal, onClose, parcelData, error }) => {
    if (!showModal) return null; 

    
    if (!parcelData) {
      return <div>Error: No parcel data available</div>;
    }
  
    
  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Parcel Status</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            X
          </button>
        </div>
        <div>
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div  className="text-black"> 

            {parcelData.map((mydata) => ( 
<div>

<p><strong>Parcel Number:</strong> {mydata.parcel_number}</p>
              <p><strong>Status:</strong> {mydata.status}</p>
              <p><strong>Last Update:</strong> {mydata.updated_at}</p>
              <p><strong>Location:</strong> {mydata.destination}</p>
              <p><strong>Sender:</strong> {mydata.sender_name} ({mydata.sender_phone})</p>
              <p><strong>Recipient:</strong> {mydata.recipient_name} ({mydata.recipient_phone})</p>
              <p><strong>Weight:</strong> {mydata.parcel_weight} kg</p>
              <p><strong>Pickup Location:</strong> {mydata.pickup_location}</p>

    </div>
                
            ))}

            
            </div>
          )}
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
