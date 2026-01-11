import React from "react";
import { Routes, Route } from "react-router-dom";
import SeatBooking from "./components/SeatBooking";
import BookingPage from "./pages/BookingPage";
import { AuthProvider } from "./assets/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SeatBooking />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}

export default App;
