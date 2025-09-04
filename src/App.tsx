
import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import ResetPassword from './pages/Reset/ResetPassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Dashboard from "./pages/admin-dashboard/admin-dashboard";
import MarcaDetalle from "./pages/MarcaDetalle/MarcaDetalle";
import HeadDashboard from "./pages/head-dashboard/head-dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/head-dashboard" element={<HeadDashboard />} />
        <Route path="/marca/:id" element={<MarcaDetalle />} />
        {/* Aquí puedes agregar más rutas para el resto de tu aplicación */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
