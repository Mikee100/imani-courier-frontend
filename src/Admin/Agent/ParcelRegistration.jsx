import React, { useState } from "react";
import axios from "axios";
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import jsPDF from "jspdf";

const ParcelRegistration = () => {
  const [parcelData, setParcelData] = useState({
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    recipientName: "",
    recipientPhone: "",
    pickupLocation: "",
    destination: "",
    parcelWeight: "",
    parcelNumber: `PARCEL-${Date.now()}`,
    category: "Documents", // Default category
    serviceType: "Standard",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [calculatedCost, setCalculatedCost] = useState(0);

  // Pricing structure
  const pricing = {
    Standard: 100,
    Express: 200,
    costPerKg: 300,
  };

  const handleChange = (e) => {
    setParcelData({ ...parcelData, [e.target.name]: e.target.value });
  };

  // Calculate the cost based on weight and service type
  const calculateCost = () => {
    const { parcelWeight, serviceType } = parcelData;
    const baseCost = pricing[serviceType];
    const weightCost = parseFloat(parcelWeight) * pricing.costPerKg;
    return baseCost + weightCost;
  };

  const validateForm = () => {
    const { senderPhone, recipientPhone, senderEmail, parcelWeight } = parcelData;

    // Basic phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(senderPhone) || !phoneRegex.test(recipientPhone)) {
      setErrorMessage("Phone numbers must be 10 digits.");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    // Validate parcel weight
    if (!parcelWeight || isNaN(parcelWeight) || parseFloat(parcelWeight) <= 0) {
      setErrorMessage("Please enter a valid parcel weight.");
      return false;
    }

    return true;
  };

  const initiateMpesaPayment = async (phoneNumber, amount) => {
    try {
      const response = await axios.post("http://localhost:3000/api/mpesa", {
        phoneNumber,
        amount,
      });

      // Check if the response contains a CheckoutRequestID
      if (!response.data.CheckoutRequestID) {
        throw new Error("M-Pesa payment failed: No CheckoutRequestID returned.");
      }

      setPaymentStatus("Payment initiated. Please complete the payment on your phone.");
      return response.data.CheckoutRequestID;
    } catch (error) {
      console.error("Error initiating M-Pesa payment:", error);
      setPaymentStatus("Failed to initiate payment. Please try again.");
      throw error;
    }
  };

  // Generate and download PDF receipt
  const generateReceipt = (parcelData, cost) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const centerX = pageWidth / 2;
    
    // Add logo (replace with your actual logo URL)
    const logoUrl = 'https://cdn-icons-png.flaticon.com/512/2091/2091672.png';
    doc.addImage(logoUrl, 'PNG', centerX - 15, 15, 30, 30);

    // Add title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Imani Courier", centerX, 60, { align: "center" });

    // Add receipt title
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("Delivery Receipt", centerX, 70, { align: "center" });

    // Add receipt number and date
    doc.setFontSize(12);
    doc.text(`Receipt Number: ${parcelData.parcelNumber}`, 15, 85);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 15, 85, { align: "right" });

    // Create vertical space
    let yPosition = 100;

    // Add divider line
    doc.setLineWidth(0.5);
    doc.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 10;

    // Sender Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Sender Information", centerX, yPosition, { align: "center" });
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${parcelData.senderName}`, 20, yPosition);
    doc.text(`Phone: ${parcelData.senderPhone}`, pageWidth - 20, yPosition, { align: "right" });
    yPosition += 8;
    doc.text(`Email: ${parcelData.senderEmail}`, 20, yPosition);
    yPosition += 15;

    // Recipient Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recipient Information", centerX, yPosition, { align: "center" });
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${parcelData.recipientName}`, 20, yPosition);
    doc.text(`Phone: ${parcelData.recipientPhone}`, pageWidth - 20, yPosition, { align: "right" });
    yPosition += 15;

    // Delivery Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Delivery Details", centerX, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${parcelData.pickupLocation}`, 20, yPosition);
    yPosition += 8;
    doc.text(`To: ${parcelData.destination}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Weight: ${parcelData.parcelWeight} kg`, 20, yPosition);
    doc.text(`Service Type: ${parcelData.serviceType}`, pageWidth - 20, yPosition, { align: "right" });
    yPosition += 15;

    // Payment Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Details", centerX, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: KES ${(cost * 0.85).toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Tax (15%): KES ${(cost * 0.15).toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: KES ${cost.toFixed(2)}`, 20, yPosition);
    yPosition += 15;

    // Footer
    doc.setLineWidth(0.3);
    doc.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing Imani Courier!", centerX, yPosition, { align: "center" });
    yPosition += 6;
    doc.text("Contact: info@imanicourier.com | Tel: +254 700 000 000", centerX, yPosition, { align: "center" });

    // Save the PDF
    doc.save(`Imani_Receipt_${parcelData.parcelNumber}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    setPaymentStatus("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Calculate the cost
      const cost = calculateCost();
      setCalculatedCost(cost);

      // Initiate M-Pesa payment and get the CheckoutRequestID
      let mpesaTransactionId;
      try {
        mpesaTransactionId = await initiateMpesaPayment(parcelData.senderPhone, cost);
      } catch (error) {
        setErrorMessage("Failed to initiate payment. Please try again.");
        setLoading(false);
        return;
      }

      // Prepare the payload
      const payload = {
        senderName: parcelData.senderName,
        senderPhone: parcelData.senderPhone,
        senderEmail: parcelData.senderEmail,
        recipientName: parcelData.recipientName,
        recipientPhone: parcelData.recipientPhone,
        pickupLocation: parcelData.pickupLocation,
        destination: parcelData.destination,
        parcelWeight: parseFloat(parcelData.parcelWeight),
        category: parcelData.category,
        cost: cost,
        mpesaTransactionId: mpesaTransactionId,
      };

      // Register the parcel with cost and M-Pesa transaction ID
      const parcelResponse = await axios.post("http://localhost:3000/api/parcels/register", payload);
      setSuccessMessage(parcelResponse.data.message);

      // Generate and download the receipt
      generateReceipt(parcelData, cost);

      // Reset form after successful registration and payment initiation
      setParcelData({
        senderName: "",
        senderPhone: "",
        senderEmail: "",
        recipientName: "",
        recipientPhone: "",
        pickupLocation: "",
        destination: "",
        parcelWeight: "",
        parcelNumber: `PARCEL-${Date.now()}`,
        category: "Documents",
        serviceType: "Standard",
      });
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Backend response error:", error.response.data);
      }
      setErrorMessage("Error registering parcel or initiating payment. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Register a Parcel</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <FaCheckCircle className="mr-2" /> {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <FaExclamationCircle className="mr-2" /> {errorMessage}
        </div>
      )}

      {/* Payment Status */}
      {paymentStatus && (
        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-center">
          {paymentStatus}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
            <input
              type="text"
              name="senderName"
              value={parcelData.senderName}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender Phone</label>
            <input
              type="text"
              name="senderPhone"
              value={parcelData.senderPhone}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Email</label>
            <input
              type="email"
              name="senderEmail"
              value={parcelData.senderEmail}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={parcelData.recipientName}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Phone</label>
            <input
              type="text"
              name="recipientPhone"
              value={parcelData.recipientPhone}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={parcelData.pickupLocation}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <input
            type="text"
            name="destination"
            value={parcelData.destination}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parcel Weight (kg)</label>
            <input
              type="number"
              name="parcelWeight"
              value={parcelData.parcelWeight}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select
              name="serviceType"
              value={parcelData.serviceType}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            >
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
            </select>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={parcelData.category}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          >
            <option value="Documents">Documents</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parcel Number</label>
          <input
            type="text"
            name="parcelNumber"
            value={parcelData.parcelNumber}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Display Calculated Cost */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg font-semibold text-gray-700">
            Total Cost: KES {calculatedCost.toFixed(2)}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center"
        >
          {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
          {loading ? "Registering..." : "Register Parcel & Pay"}
        </button>
      </form>
    </div>
  );
};

export default ParcelRegistration;