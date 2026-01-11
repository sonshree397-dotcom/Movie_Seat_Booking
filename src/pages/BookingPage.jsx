import React, { useEffect, useState } from "react";
import { useAuth } from "../assets/context/AuthContext";
import { movieData } from "../data";
import { useNavigate } from "react-router-dom"; // <- Needed for navigation

const VIP_PRICE = 400;
const STANDARD_PRICE = 250;

export default function BookingPage() {
  const { isLoggedIn, username } = useAuth();
  const [userSeats, setUserSeats] = useState([]);
  const navigate = useNavigate(); // <-- useNavigate for Go Back

  useEffect(() => {
    if (!isLoggedIn) return;
    const allBookings = JSON.parse(localStorage.getItem("userBookings")) || {};
    setUserSeats(allBookings[username] || []);
  }, [username, isLoggedIn]);

  // Navigate back to seat booking
  const handleGoBack = () => {
    navigate("/");
  };

  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg text-center">
          Please login to see your booked seats 🎟
        </p>
        <button
          onClick={handleGoBack}
          className="mt-6 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold text-white shadow-lg transition-all"
        >
          Go Back
        </button>
      </div>
    );

  if (userSeats.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg text-center animate-pulse">
          You have not booked any seats yet 🎟
        </p>
        <p className="mt-4 text-center text-gray-300 italic">
          Go back to the booking page to select your seats.
        </p>
        <button
          onClick={handleGoBack}
          className="mt-6 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold text-white shadow-lg transition-all"
        >
          Go Back
        </button>
      </div>
    );

  // Calculate total price
  const totalPrice = userSeats.reduce((sum, seatId) => {
    const row = movieData.find((r) => r.seats.some((s) => s.id === seatId));
    return sum + (row?.type === "vip" ? VIP_PRICE : STANDARD_PRICE);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white flex flex-col items-center">
      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="mb-6 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold text-white shadow-lg transition-all self-start"
      >
        ← Go Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">🎟 Your Booked Seats</h1>

      {/* Booked seats */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {userSeats.map((seatId) => {
          const row = movieData.find((r) => r.seats.some((s) => s.id === seatId));
          const seatType = row?.type;

          return (
            <div
              key={seatId}
              className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl font-bold flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 cursor-default ${
                seatType === "vip"
                  ? "bg-gradient-to-tr from-pink-500 to-red-500 text-white"
                  : "bg-gradient-to-tr from-green-400 to-emerald-500 text-white"
              }`}
            >
              {seatId}
            </div>
          );
        })}
      </div>

      {/* Booking summary */}
      <div className="bg-slate-800 bg-opacity-80 p-6 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">💰 Booking Summary</h2>
        <p className="mb-2 text-lg">
          Seats: <span className="font-semibold">{userSeats.join(", ")}</span>
        </p>
        <p className="mb-2 text-lg">
          Total Tickets: <span className="font-semibold">{userSeats.length}</span>
        </p>
        <p className="mb-2 text-xl font-bold text-yellow-400">Total: Rs. {totalPrice}</p>
        <p className="text-sm mt-2 text-gray-300 italic">
          Your tickets are non-refundable. Enjoy the movie! 🍿
        </p>
      </div>
    </div>
  );
}
