import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Home/Homepage";
import Register from "./Registration/Register";
import NavigationBar from "./NavigationBar/NavigationBar";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminRegistration from "./Admin/AdminRegistration";
import AgentDeliveryDashboard from "./Admin/Delivery/AgentDeliveryDashboard";
import AgentAdminDashboard from "./Admin/Agent/AgentAdminDashboard";
import ParcelRegistration from "./Admin/Agent/ParcelRegistration";
import LoginPage from "./Registration/LoginPage";
import OrdersPage from "./User/OrdersPage.JSX";
import ReleasedItemsPage from "./Admin/Delivery/ReleasedItemsPage";
import DailyReportPage from "./Admin/Agent/DailyReportPage";
import DeliveredItemsPage from "./Admin/Agent/DeliveredItemsPage";
import ParcelTracking from "./Admin/Agent/ParcelTracking";
import AuditLogPage from "./Admin/Agent/AuditLogPage";
import CreateShipmentPage from "./User/CreateShipmentPage";
import VehicleRegistration from "./Admin/VehicleRegistration";
import DriverRegistration from "./Admin/DriverRegistration";
import AssignParcelPage from "./Admin/Agent/AssignParcelPage";
import UserProfile from "./User/UserProfile";
import SystemReport from "./Admin/SystemReport";
import { AuthProvider, AuthContext } from "./General/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <NavigationBar />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <>

      <Routes>
      
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/register" element={<AdminRegistration />} />
        <Route path="/admin/delivery/dashboard" element={<AgentDeliveryDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route path="vehicle-registration" element={<VehicleRegistration />} />
          <Route path="driver-registration" element={<DriverRegistration />} />
          <Route path="audit" element={<AuditLogPage />} />
          <Route path="daily-report" element={<DailyReportPage />} />
          <Route path="system-report" element={<SystemReport />} />
        </Route>
        <Route path="/admin/agent/dashboard" element={<AgentAdminDashboard />}>
          <Route path="register-parcel" element={<ParcelRegistration />} />
          <Route path="track-parcel" element={<ParcelTracking />} />
          <Route path="confirm-delivery" element={<DeliveredItemsPage />} />
          <Route path="assign-parcel" element={<AssignParcelPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin/released-items" element={<ReleasedItemsPage />} />
        <Route path="/create-shipment" element={<CreateShipmentPage />} />
        <Route path="/userprofile" element={<UserProfile />} />
      </Routes>
    </>
  );
}