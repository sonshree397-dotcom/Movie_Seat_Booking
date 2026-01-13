import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../assets/context/useAuthContext";
import { toast } from "react-toastify";
import jariPoster from "../assets/jari.jpg";
import big_hero_6 from "../assets/big_hero_6.jpg";
import spongebob from "../assets/spongebob.jpg";
import dhol from "../assets/dhol.jpg";
import frozen from "../assets/frozen.jpg";  
import { movieList } from "../data/movieDetails";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn, login, register, logout, username } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formUsername, setFormUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleMovieClick = (movie) => {
    if (!isLoggedIn) {
      setShowAuth(true);
      toast.info("Please login or register first");
      return;
    }
    navigate("/movie-details", { state: { movie } });
  };

  const handleLogout = () => {
    logout();
  };

  const handleMyBooking = () => {
    navigate("/booking");
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = login(formUsername, password);
      if (success) {
        setShowAuth(false);
        setFormUsername("");
        setPassword("");
        // Stay on landing page after login
      }
    } else {
      const success = register(formUsername, password);
      if (success) {
        setIsLogin(true);
        toast.success("Registration successful! Please login.");
      }
    }
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="glass-morphism bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
            {/* Animated background decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg animate-bounce">
                {isLogin ? (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m3 0a9 9 0 11-18 0 9 9 0 0118 0zm-9 9a9 9 0 01-9-9v9m0 0h18" />
                  </svg>
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-200 text-sm">
                {isLogin ? "Login to book your perfect movie experience" : "Join us for an amazing cinema journey"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 focus:bg-white/15"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 focus:bg-white/15"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLogin ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m3 0a9 9 0 11-18 0 9 9 0 0118 0zm-9 9a9 9 0 01-9-9v9m0 0h18" />
                      </svg>
                      Register
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-200 hover:text-white transition-all duration-200 text-sm group"
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300">
                  {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowAuth(false)}
              className="mt-4 w-full py-2 px-4 bg-red-500/20 border border-red-400/30 text-red-200 rounded-lg hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      <div className="relative z-10 text-center mb-2 sm:mb-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
          🎬 Movie Seat Booking
        </h1>
        <p className="text-sm sm:text-base md:text-xl text-gray-200 drop-shadow-md">
          Experience cinema like never before
        </p>
      </div>
      {isLoggedIn && username && (
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-md animate-fade-in mb-2">
          Welcome {username}
        </p>
      )}
      <div className="relative z-10 text-center mb-6 sm:mb-8">
        
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">Now Showing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {movieList.map((movie) => (
            <div 
              key={movie.id} 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleMovieClick(movie)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">{movie.title}</h3>
                    <p className="text-gray-200 text-sm sm:text-base mb-4">{movie.genre}</p>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-white text-sm sm:text-base font-semibold">
                        {isLoggedIn ? "Select Showtime" : "Login to Book"}
                      </span>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
        {isLoggedIn ? (
          <>
            <button
              onClick={handleMyBooking}
              className="glass-morphism bg-white/10 backdrop-blur-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Booking
            </button>
            
            <button
              onClick={handleLogout}
              className="glass-morphism bg-red-500/20 backdrop-blur-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-red-400/30 text-red-200 hover:bg-red-500/30 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsLogin(true);
                setShowAuth(true);
              }}
              className="glass-morphism bg-white/10 backdrop-blur-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </button>
            
            <button
              onClick={() => {
                setIsLogin(false);
                setShowAuth(true);
              }}
              className="glass-morphism bg-blue-500/20 backdrop-blur-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-blue-400/30 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Register
            </button>
          </>
        )}
      </div>

      <style>{`
        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
