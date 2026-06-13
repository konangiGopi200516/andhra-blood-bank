import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import BloodInventory from './pages/BloodInventory';
import SearchBlood from './pages/SearchBlood';
import DonorDashboard from './pages/DonorDashboard';
import DonorAuth from './pages/DonorAuth';
import HospitalDashboard from './pages/HospitalDashboard';
import HospitalRequest from './pages/HospitalRequest';
import HospitalAuth from './pages/HospitalAuth';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donor/auth" element={<DonorAuth />} />
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
          <Route path="/hospital/auth" element={<HospitalAuth />} />
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/hospital/request" element={<HospitalRequest />} />
          <Route path="/inventory" element={<BloodInventory />} />
          <Route path="/admin" element={<AdminDashboard />} /> 
          <Route path="/search" element={<SearchBlood />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
