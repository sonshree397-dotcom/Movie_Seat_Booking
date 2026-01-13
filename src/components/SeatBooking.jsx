import React, { useEffect, useState } from "react";
import { movieData } from "../data";
import { toast } from "react-toastify";
import { useAuth } from "../assets/context/useAuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const VIP_PRICE = 400;
const STANDARD_PRICE = 250;
const MAX_SELECTION = 5;

function KhaltiChair({ seatId, color }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="56" height="56" viewBox="0 0 64 64" fill={color}>
        <path d="M16 26c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v10H16V26z" />
        <path d="M12 36h40v10c0 3.3-2.7 6-6 6H18c-3.3 0-6-2.7-6-6V36z" />
        <rect x="14" y="52" width="6" height="8" />
        <rect x="44" y="52" width="6" height="8" />
      </svg>
      <span className="text-sm font-bold">{seatId}</span>
    </div>
  );
}

export default function SeatBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, username, logout } = useAuth();

  const showtime = location.state?.showtime || "Not Selected";
  const movieTitle = location.state?.movieTitle || "Movie";

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userBookedSeats, setUserBookedSeats] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    if (username && showtime && movieTitle) {
      const allBookings = JSON.parse(localStorage.getItem("userBookings")) || {};
      const userBookings = allBookings[username] || {};
      const movieBookings = userBookings[movieTitle] || {};
      const showtimeBookings = movieBookings[showtime] || {};
      setTimeout(() => setUserBookedSeats(showtimeBookings.seats || []), 0);
    }
  }, [isLoggedIn, username, showtime, movieTitle, navigate]);

  const handleSeatClick = (seat) => {
    if (!isLoggedIn) return toast.warn("Please login first");

    const seatId = seat.id;
    if (seat.isReserved || userBookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= MAX_SELECTION) {
        toast.warn(`Max ${MAX_SELECTION} seats only`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleMyBooking = () => {
    navigate("/booking");
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((sum, seatId) => {
      const row = movieData.find(r => r.seats.some(s => s.id === seatId));
      return sum + (row?.type === "vip" ? VIP_PRICE : STANDARD_PRICE);
    }, 0);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBooking = () => {
    if (!isLoggedIn) return toast.warn("Login first");
    if (selectedSeats.length === 0) return toast.warn("Select seats");

    const updatedSeats = [...userBookedSeats, ...selectedSeats];
    const total = calculateTotalPrice();

    const allBookings = JSON.parse(localStorage.getItem("userBookings")) || {};
    if (!allBookings[username]) {
      allBookings[username] = {};
    }
    if (!allBookings[username][movieTitle]) {
      allBookings[username][movieTitle] = {};
    }
    
    allBookings[username][movieTitle][showtime] = {
      seats: updatedSeats,
      showtime,
      movieTitle,
      totalPrice: total,
      bookingDate: new Date().toISOString()
    };

    localStorage.setItem("userBookings", JSON.stringify(allBookings));
    setUserBookedSeats(updatedSeats);
    setSelectedSeats([]);

    toast.success(
      `🎉 ${movieTitle} | ${showtime}\nSeats: ${selectedSeats.join(", ")}\nTotal: Rs. ${total}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => navigate("/")}
          className="glass-morphism bg-white/10 backdrop-blur-lg px-3 sm:px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
        
        <button
          onClick={handleLogout}
          className="glass-morphism bg-red-500/20 backdrop-blur-lg px-3 sm:px-4 py-2 rounded-lg border border-red-400/30 text-red-200 hover:bg-red-500/30 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">🎬 {movieTitle}</h1>
          <p className="text-gray-300 text-sm sm:text-base">⏰ Showtime: {showtime}</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* Seat Grid - Left/Top Side */}
          <div className="flex-1">
            {movieData.map((row) => (
              <div key={row.row} className="mb-3 sm:mb-4">
                <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Row {row.row}</p>
                <div className="flex gap-2 sm:gap-4 flex-wrap justify-center sm:justify-start">
                  {row.seats.map((seat) => {
                    const seatId = seat.id;
                    const booked =
                      seat.isReserved || userBookedSeats.includes(seatId);
                    const selected = selectedSeats.includes(seatId);

                    const color = booked
                      ? "#ef4444"
                      : selected
                      ? "#3b82f6"
                      : "#22c55e";

                    return (
                      <button
                        key={seatId}
                        disabled={booked}
                        onClick={() => handleSeatClick(seat)}
                        className="transform hover:scale-105 transition-transform"
                      >
                        <KhaltiChair seatId={seatId} color={color} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Booking Info - Right/Bottom Side */}
          <div className="xl:w-96 w-full">
            <div className="glass-morphism bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-lg border border-white/20 xl:sticky xl:top-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Booking Summary</h3>
              
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-300 mb-2 text-sm sm:text-base">Selected Seats:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((seatId) => {
                      const row = movieData.find(r => r.seats.some(s => s.id === seatId));
                      const seatType = row?.type === "vip" ? "VIP" : "Standard";
                      
                      return (
                        <div key={seatId} className="bg-blue-500/20 border border-blue-400/30 px-2 sm:px-3 py-1 rounded-lg">
                          <span className="text-xs sm:text-sm font-semibold">{seatId}</span>
                          <span className="text-xs text-gray-300 ml-1">({seatType})</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 italic text-sm sm:text-base">No seats selected</p>
                  )}
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm sm:text-base">Total Price:</span>
                  <span className="text-xl sm:text-2xl font-bold text-green-400">Rs. {calculateTotalPrice()}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  VIP: Rs. {VIP_PRICE} | Standard: Rs. {STANDARD_PRICE}
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={handleBooking}
                  disabled={selectedSeats.length === 0}
                  className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base ${
                    selectedSeats.length === 0
                      ? "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105"
                  }`}
                >
                  Book Now ({selectedSeats.length} seats)
                </button>

                <button
                  onClick={handleMyBooking}
                  className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                >
                  My Booking
                </button>
              </div>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
