import React, { useEffect, useState } from "react";
import { useAuth } from "../assets/context/useAuthContext";
import { movieData } from "../data";
import { useNavigate } from "react-router-dom";

const VIP_PRICE = 400;
const STANDARD_PRICE = 250;

export default function BookingPage() {
  const { isLoggedIn, username, logout } = useAuth();
  const [bookingInfo, setBookingInfo] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    const allBookings = JSON.parse(localStorage.getItem("userBookings")) || {};
    console.log("All bookings from localStorage:", allBookings);
    console.log("Username:", username);
    console.log("User bookings:", allBookings[username]);
    setTimeout(() => setBookingInfo(allBookings[username] || {}), 0);
  }, [username, isLoggedIn]);

  if (!isLoggedIn)
    return <p className="text-center text-white">Please login</p>;

  // Debug current state
  console.log("Current bookingInfo:", bookingInfo);

  // Convert nested booking structure to display format
  const getAllBookings = () => {
    const bookings = [];
    
    // Handle new nested structure: user -> movie -> showtime -> booking
    if (bookingInfo && typeof bookingInfo === 'object') {
      // Check if it's the new nested structure (has movie titles as keys)
      const hasMovieKeys = Object.keys(bookingInfo).some(key => 
        typeof bookingInfo[key] === 'object' && !bookingInfo[key].seats
      );
      
      if (hasMovieKeys) {
        // New nested structure
        Object.keys(bookingInfo).forEach(movieTitle => {
          const movieBookings = bookingInfo[movieTitle];
          if (movieBookings && typeof movieBookings === 'object') {
            Object.keys(movieBookings).forEach(showtime => {
              const showtimeBooking = movieBookings[showtime];
              if (showtimeBooking && showtimeBooking.seats) {
                bookings.push({
                  movieTitle,
                  showtime,
                  seats: showtimeBooking.seats,
                  totalPrice: showtimeBooking.totalPrice || calculatePrice(showtimeBooking.seats),
                  bookingDate: showtimeBooking.bookingDate || new Date().toISOString()
                });
              }
            });
          }
        });
      } else {
        // Old flat structure - single booking
        if (bookingInfo.seats && bookingInfo.showtime && bookingInfo.movieTitle) {
          bookings.push({
            movieTitle: bookingInfo.movieTitle,
            showtime: bookingInfo.showtime,
            seats: bookingInfo.seats,
            totalPrice: bookingInfo.totalPrice || calculatePrice(bookingInfo.seats),
            bookingDate: bookingInfo.bookingDate || new Date().toISOString()
          });
        }
      }
    }
    
    return bookings;
  };

  // Helper function to calculate price
  const calculatePrice = (seats) => {
    return seats.reduce((sum, seatId) => {
      const row = movieData.find(r => r.seats.some(s => s.id === seatId));
      return sum + (row?.type === "vip" ? VIP_PRICE : STANDARD_PRICE);
    }, 0);
  };

  const allBookings = getAllBookings();

  if (allBookings.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        
        {/* Top Navigation */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="glass-morphism bg-blue-500/20 backdrop-blur-lg px-4 py-2 rounded-lg border border-blue-400/30 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Back Home
          </button>
          
          <button
            onClick={handleLogout}
            className="glass-morphism bg-red-500/20 backdrop-blur-lg px-4 py-2 rounded-lg border border-red-400/30 text-red-200 hover:bg-red-500/30 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="glass-morphism bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-white mb-2">You have not booked a ticket</h2>
            <p className="text-gray-200 mb-6">Book your first movie experience now!</p>
            <button
              onClick={() => navigate("/")}
              className="glass-morphism bg-blue-500/20 backdrop-blur-lg px-6 py-3 rounded-lg border border-blue-400/30 text-white hover:bg-blue-500/30 transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Browse Movies
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Top Navigation - Fixed Position */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="glass-morphism bg-blue-500/20 backdrop-blur-lg px-4 py-2 rounded-lg border border-blue-400/30 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Back Home
        </button>
        
        <button
          onClick={handleLogout}
          className="glass-morphism bg-red-500/20 backdrop-blur-lg px-4 py-2 rounded-lg border border-red-400/30 text-red-200 hover:bg-red-500/30 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto pt-20">
        <div className="glass-morphism bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">🎬 My Bookings</h1>
          
          <div className="space-y-4">
            {allBookings.map((booking, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{booking.movieTitle}</h3>
                    <p className="text-gray-200">⏰ {booking.showtime}</p>
                    <p className="text-gray-300 text-sm">
                      📅 {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-lg">Rs. {booking.totalPrice}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {booking.seats.map((seatId) => {
                    const row = movieData.find(r => r.seats.some(s => s.id === seatId));
                    const seatType = row?.type === "vip" ? "VIP" : "Standard";
                    
                    return (
                      <div key={seatId} className="bg-blue-500/20 border border-blue-400/30 px-2 sm:px-3 py-1 rounded-lg">
                        <span className="text-xs sm:text-sm font-semibold">{seatId}</span>
                        <span className="text-xs text-gray-300 ml-1">({seatType})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
