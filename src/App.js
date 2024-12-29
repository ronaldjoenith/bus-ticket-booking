import React, { useState } from "react";
import "./App.css";

const App = () => {
  const totalRows = 8; // 8 rows and 2 columns
  const totalColumns = 2;
  const totalSeats = totalRows * totalColumns;

  // Initial state of seats
  const [seats, setSeats] = useState(
    Array.from({ length: totalSeats }, (_, i) => ({
      seatNo: i + 1,
      booked: false,
      bookedBy: null,
      gender: null,
    }))
  );

  // Form Data to manage user inputs
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    bookingType: "individual", // Default is individual
  });

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle seat booking
  const handleSeatClick = (seat) => {
    const { username, gender } = formData;

    if (!username || !gender) {
      alert("Please fill in all fields to book a seat.");
      return;
    }

    // Check if the seat is already booked
    if (seat.booked) {
      alert("This seat is already booked.");
      return;
    }

    // Check nearby seats if the user is male and if a female has booked a nearby seat
    if (gender === "male") {
      const nearbySeats = getNearbySeats(seat.seatNo);
      for (let nearbySeat of nearbySeats) {
        if (seats[nearbySeat - 1].booked && seats[nearbySeat - 1].gender === "female") {
          alert("You cannot book this seat next to a female.");
          return; // Stop execution here if condition is met
        }
      }
    }

    // Update seat details
    const updatedSeats = seats.map((s) =>
      s.seatNo === seat.seatNo
        ? { ...s, booked: true, bookedBy: username, gender: gender }
        : s
    );

    setSeats(updatedSeats);

    alert(`Seat ${seat.seatNo} booked successfully by ${username}.`);
  };

  // Get nearby seats (left and right side in a 2-column grid)
  const getNearbySeats = (seatNo) => {
    const nearbySeats = [];
    if (seatNo % totalColumns !== 1) nearbySeats.push(seatNo - 1); // Left seat
    if (seatNo % totalColumns !== 0) nearbySeats.push(seatNo + 1); // Right seat
    return nearbySeats;
  };

  return (
    <div className="container">
      <h1>Bus Seat Booking System</h1>

      {/* Booking Form */}
      <div className="form-container">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </label>

        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label>
          Booking Type:
          <select
            name="bookingType"
            value={formData.bookingType}
            onChange={handleInputChange}
          >
            <option value="individual">Individual</option>
            <option value="family">Family</option>
          </select>
        </label>
      </div>

      {/* Seats Grid */}
      <div className="seats-container">
        <div className="grid">
          {seats.map((seat) => (
            <div
              key={seat.seatNo}
              className={`seat ${seat.booked ? "booked" : ""}`}
              onClick={() => !seat.booked && handleSeatClick(seat)}
              title={
                seat.booked
                  ? `Booked by: ${seat.bookedBy}\nGender: ${seat.gender}`
                  : "Available"
              }
            >
              Seat {seat.seatNo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;