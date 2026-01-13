import { Routes, Route } from "react-router-dom";
import SeatBooking from "./components/SeatBooking";
import BookingPage from "./pages/BookingPage";
import MovieDetails from "./components/MovieDetails";
import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./assets/context/useAuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/movie-details" element={<MovieDetails />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/seat-booking" element={<SeatBooking />} />
      </Routes>
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}
