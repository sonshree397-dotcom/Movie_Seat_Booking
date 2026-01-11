import React, { useEffect, useState } from "react";
import { movieData } from "../data";
import { toast } from "react-toastify";
import { useAuth } from "../assets/context/AuthContext";
import { useNavigate } from "react-router-dom";

const VIP_PRICE = 400;
const STANDARD_PRICE = 250;
const MAX_SELECTION = 5;

/* ---------- BIG KHALTI SOFA ---------- */
function KhaltiChair({ seatId, color }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        className="rounded-xl p-2"
        fill={color} // Chair color only
      >
        <path d="M16 26c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v10H16V26z" />
        <path d="M12 36h40v10c0 3.3-2.7 6-6 6H18c-3.3 0-6-2.7-6-6V36z" />
        <rect x="14" y="52" width="6" height="8" />
        <rect x="44" y="52" width="6" height="8" />
      </svg>
      <span className="text-sm font-bold">{seatId}</span>
    </div>
  );
}

/* ---------- LEGEND ---------- */
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-4 w-4 rounded" style={{ backgroundColor: color }} />
      <span className="text-sm text-white">{label}</span>
    </div>
  );
}

export default function SeatBooking() {
  const navigate = useNavigate();
  const { isLoggedIn, username, login, logout, register } = useAuth();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userBookedSeats, setUserBookedSeats] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Login inputs
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register inputs
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    if (!username) return;
    const allBookings = JSON.parse(localStorage.getItem("userBookings")) || {};
    setUserBookedSeats(allBookings[username] || []);
  }, [username]);

  const handleLogin = () => {
    const success = login(loginUsername, loginPassword);
    if (success) {
      setShowLogin(false);
      setLoginUsername("");
      setLoginPassword("");
    }
  };

  const handleRegister = () => {
    if (!registerUsername || !registerPassword) {
      toast.warn("Enter username and password");
      return;
    }
    const success = register(registerUsername, registerPassword);
    if (success) {
      setShowRegister(false);
      setRegisterUsername("");
      setRegisterPassword("");
    }
  };

  const handleLogout = () => {
    logout();
    setSelectedSeats([]);
    setUserBookedSeats([]);
  };

  const handleSeatClick = (seat) => {
    if (!isLoggedIn) {
      toast.warn("Please login first");
      return;
    }

    const seatId = seat.id;
    if (seat.isReserved || userBookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      if (selectedSeats.length >= MAX_SELECTION) {
        toast.warn(`Max ${MAX_SELECTION} seats only`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = () => {
    if (!isLoggedIn) {
      toast.warn("Please login to book seats");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.warn("Select seats first");
      return;
    }

    const updatedUserSeats = [...userBookedSeats, ...selectedSeats];
    const allBookings = JSON.parse(localStorage.getItem("userBookings")) || {};
    allBookings[username] = updatedUserSeats;
    localStorage.setItem("userBookings", JSON.stringify(allBookings));
    setUserBookedSeats(updatedUserSeats);

    const total = selectedSeats.reduce((sum, seatId) => {
      const row = movieData.find((r) =>
        r.seats.some((s) => s.id === seatId)
      );
      return sum + (row?.type === "vip" ? VIP_PRICE : STANDARD_PRICE);
    }, 0);

    toast.success(
      `🎉 Booking Successful! Seats: ${selectedSeats.join(", ")} | Total: Rs. ${total}`
    );
    setSelectedSeats([]);
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const row = movieData.find((r) =>
      r.seats.some((s) => s.id === seatId)
    );
    return sum + (row?.type === "vip" ? VIP_PRICE : STANDARD_PRICE);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 text-white">
      {/* ---------- TOP SECTION ---------- */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/30 shadow-xl flex flex-col items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white flex items-center gap-2 sm:gap-3">
          <span className="text-3xl sm:text-4xl">🎬</span>
          CineMax Seat Booking
        </h1>

        {/* ---------- LEGEND BELOW TITLE ---------- */}
        <div className="grid grid-cols-3 gap-4 mt-2 justify-center w-full max-w-xs">
          <LegendItem color="#22c55e" label="Available" />
          <LegendItem color="#3b82f6" label="Selected" />
          <LegendItem color="#ef4444" label="Booked" />
        </div>

        {/* LOGIN / REGISTER BUTTONS */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:scale-105 transform transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:scale-105 transform transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-400 to-red-600 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:scale-105 transform transition"
              >
                Logout
              </button>
              <button
                onClick={() => navigate("/booking")}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:scale-105 transform transition"
              >
                My Booking
              </button>
            </>
          )}
        </div>
      </div>

      {/* ---------- SEATS + SUMMARY ---------- */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Seats Section */}
        <div className="lg:col-span-3 space-y-6">
          {movieData.map((row) => (
            <div key={row.row}>
              <p className="font-semibold mb-2">Row {row.row}</p>
              <div className="grid grid-cols-4 gap-4 lg:flex lg:flex-nowrap lg:gap-4">
                {row.seats.map((seat) => {
                  const seatId = seat.id;
                  const isBookedOrReserved =
                    userBookedSeats.includes(seatId) || seat.isReserved;
                  const isSelected = selectedSeats.includes(seatId);

                  const color = isBookedOrReserved
                    ? "#ef4444"
                    : isSelected
                    ? "#3b82f6"
                    : "#22c55e";

                  return (
                    <button
                      key={seat.id}
                      disabled={isBookedOrReserved}
                      onClick={() => handleSeatClick(seat)}
                      className="focus:outline-none disabled:cursor-not-allowed"
                    >
                      <KhaltiChair seatId={seatId} color={color} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ---------- SCREEN LABEL ---------- */}
          <div className="mt-4 flex justify-center">
            <div className="w-full max-w-3xl border-t-2 border-white/40 text-center pt-2 text-white/60 font-bold">
              SCREEN THIS WAY
            </div>
          </div>
        </div>

        {/* Booking Summary Section */}
        <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="font-bold mb-2">🎟 Booking Summary</h2>
          <p>
            Seats: {selectedSeats.length ? selectedSeats.join(", ") : "None"}
          </p>
          <p className="text-xl font-semibold">Total: Rs. {totalPrice}</p>
          <button
            onClick={handleBooking}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg mt-4 font-bold transition w-full"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* ---------- LOGIN MODAL ---------- */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl p-8 w-96 shadow-xl flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Login
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
            />

            <div className="flex justify-between gap-4 mt-2">
              <button
                onClick={handleLogin}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- REGISTER MODAL ---------- */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl p-8 w-96 shadow-xl flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Register
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
            />

            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
            />

            <div className="flex justify-between gap-4 mt-2">
              <button
                onClick={handleRegister}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition"
              >
                Register
              </button>
              <button
                onClick={() => setShowRegister(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
