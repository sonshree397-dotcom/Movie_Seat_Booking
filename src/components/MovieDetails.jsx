import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../assets/context/useAuthContext";
import { movieDetails } from "../data/movieDetails";

export default function MovieDetails() {
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const movie = location.state?.movie || movieDetails;

  useEffect(() => {
    // If no movie data and no navigation state, redirect to landing page
    if (!location.state?.movie && !movieDetails) {
      navigate("/");
    }
  }, [location.state, movieDetails, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProceed = () => {
    navigate("/seat-booking", {
      state: {
        showtime: selectedTime,
        movieTitle: movie.title,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Logout Button */}
      <div className="relative z-10 flex justify-end p-4">
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

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="glass-morphism bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/20">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-4 sm:mb-6">{movie.title}</h1>

          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto rounded-lg shadow-xl mb-4 sm:mb-6"
          />

          <div className="text-center text-white mb-6 sm:mb-8">
            <p className="text-lg sm:text-xl mb-2"><b>Genre:</b> {movie.genre}</p>
            <p className="text-sm sm:text-base text-gray-200">{movie.description}</p>
          </div>

          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Select Showtime</h3>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {movie.showtimes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                    selectedTime === t
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {selectedTime && (
              <button
                onClick={handleProceed}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
              >
                Proceed to Seat Booking
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
