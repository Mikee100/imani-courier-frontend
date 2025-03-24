// pages/Homepage.jsx
import React,{useState } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';

export default function Homepage() {
  const navigate = useNavigate();
  const [parcelNumber, setParcelNumber] = useState('');
  const [parcelData, setParcelData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCreateShipment = () => {
    console.log('Button clicked');
    navigate('/create-shipment');
  };

  const handleTrackParcel = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/track-parcel?parcelNumber=${parcelNumber}`);
      setParcelData(response.data);
      
      setError(null);
      setShowModal(true);
    } catch (error) {
      setError('Parcel not found');
      setParcelData(null);
      setShowModal(true);
    }
  };
  const closeModal = () => setShowModal(false); // Function to close the modal


  return (
    <div className="min-h-screen bg-gray-50">
    
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Fast & Reliable Courier Services</h1>
          <p className="text-xl mb-8">Delivering your packages with care and precision</p>
          
          {/* Tracking Input */}
          <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-2 flex">
          <input
  type="text"
  placeholder="Enter tracking number"
  className="flex-1 p-2 text-gray-800 outline-none"
  value={parcelNumber} // Change this to parcelNumber
  onChange={(e) => setParcelNumber(e.target.value)} // Change this to setParcelNumber
/>
<button onClick={handleTrackParcel} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
  Track
</button>

            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">🚚 Express Delivery</h3>
            <p className="text-gray-600">Guanteed next-day delivery for urgent shipments</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">🌍 International Shipping</h3>
            <p className="text-gray-600">Worldwide delivery with real-time tracking</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">📦 Package Insurance</h3>
            <p className="text-gray-600">Full-value protection for your shipments</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Actions</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button  className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              Schedule a Pickup
            </button>
            <button  onClick={handleCreateShipment} className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              Create New Shipment
            </button>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              Download Reports
            </button>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
        <p className="text-gray-600 mb-8">Our support team is available 24/7</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Contact Support
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4">&copy; 2023 SwiftCourier. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#privacy" className="hover:text-blue-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-blue-400">Terms of Service</a>
            <a href="#faq" className="hover:text-blue-400">FAQ</a>
          </div>
        </div>
      </footer>

      <Modal
        showModal={showModal}
        onClose={closeModal}
        parcelData={parcelData}
        error={error}
      />
    </div>
  );
}