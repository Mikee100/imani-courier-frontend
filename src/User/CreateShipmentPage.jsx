import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../General/AuthContext';


export default function CreateShipmentPage() {
  const { user, loading } = useContext(AuthContext); // Get user from AuthContext
  const [shipmentData, setShipmentData] = useState({
    senderName: '',
    recipientName: '',
    phone: '',
    email: '',
    userId: '',
    senderAddress: '',
    recipientAddress: '',
    weight: '',
    dimensions: '',
    parcelImage: null,
  });

  // Fetch user data and pre-fill the form when the component is mounted
  useEffect(() => {
    if (!loading && user) {
      // Fetch user data from the API based on email
      axios.get(`http://localhost:3000/api/user/${user.email}`)
        .then((response) => {
          const userData = response.data;

          // Set shipment data with the fetched user data
          setShipmentData({
            senderName: userData.name || '',
            email: userData.email || '',
            userId: userData.id || '',
            phone: userData.phone || '',
            senderAddress: '', // You may want to adjust this field if you have address info
            recipientAddress: '', // This can be left empty for now
            recipientName: '',
            weight: '',
            dimensions: '',
            parcelImage: null,
          });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user, loading]);

  const handleChange = (e) => {
    setShipmentData({
      ...shipmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setShipmentData({
      ...shipmentData,
      parcelImage: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(shipmentData).forEach(key => {
      if (key !== 'parcelImage') {
        formData.append(key, shipmentData[key]);
      }
    });

    if (shipmentData.parcelImage) {
      formData.append('parcelImage', shipmentData.parcelImage);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/shipments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Shipment created successfully!');
      setShipmentData({
        senderName: '',
        recipientName: '',
        phone: '',
        email: '',
        userId: '',
        senderAddress: '',
        recipientAddress: '',
        weight: '',
        dimensions: '',
        parcelImage: null,
      });
    } catch (error) {
      console.error('Error creating shipment:', error);
      alert('There was an error creating your shipment.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Create a New Shipment</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        {/* Sender Information */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Sender Name</label>
          <input 
            type="text" 
            name="senderName" 
            className="w-full px-4 py-2 border rounded-md" 
            placeholder="Enter sender's name" 
            value={shipmentData.senderName}
            onChange={handleChange}
            disabled // Make this field disabled
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
          <input 
            type="text" 
            name="phone" 
            className="w-full px-4 py-2 border rounded-md" 
            placeholder="Enter your phone number" 
            value={shipmentData.phone}
            onChange={handleChange}
            disabled // Make this field disabled
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input 
            type="email" 
            name="email" 
            className="w-full px-4 py-2 border rounded-md" 
            placeholder="Enter your email" 
            value={shipmentData.email}
            onChange={handleChange}
            disabled // Make this field disabled
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">User ID</label>
          <input 
            type="text" 
            name="userId" 
            className="w-full px-4 py-2 border rounded-md" 
            placeholder="Enter your user ID" 
            value={shipmentData.userId}
            onChange={handleChange}
            disabled // Make this field disabled
            required
          />
        </div>

        {/* Parcel Information */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Parcel Weight (kg)</label>
          <input 
            type="number" 
            name="weight" 
            className="w-full px-4 py-2 border rounded-md" 
            placeholder="Enter parcel weight" 
            value={shipmentData.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Parcel Dimensions (LxWxH in cm)</label>
          <input 
            type="text" 
            name="dimensions" 
            className="w-full px-4 py-2 border rounded-md" 
            placeholder="e.g., 30x20x10" 
            value={shipmentData.dimensions}
            onChange={handleChange}
            required
          />
        </div>

        {/* Parcel Image */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Parcel Image</label>
          <input 
            type="file" 
            name="parcelImage" 
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Shipping Addresses */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Sender Address</label>
          <input 
            type="text" 
            name="senderAddress" 
            className="w-full px-4 py-2 border rounded-md" 
            placeholder="Enter sender's address" 
            value={shipmentData.senderAddress}
            onChange={handleChange}
            disabled // Make this field disabled
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Recipient Address</label>
          <input 
            type="text" 
            name="recipientAddress" 
            className="w-full px-4 py-2 border rounded-md" 
            placeholder="Enter recipient's address" 
            value={shipmentData.recipientAddress}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 w-full">
          Create Shipment
        </button>
      </form>
    </div>
  );
}
