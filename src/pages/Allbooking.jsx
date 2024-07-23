import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Allbooking.css"; // Import the CSS file for styling

export default function Allbooking() {
  const navigate = useNavigate(); // For navigation to different routes
  const { user } = useContext(UserContext); // Get the logged-in user context
  const [Allbooking, setAllbooking] = useState(null); // State to store all bookings

  // Fetch all bookings when the component mounts
  useEffect(() => {
    // If user is not logged in, navigate to login page
    if (user === null) {
      navigate("/");
    } else if(user.admin){
      // Fetch all bookings from the server
      axios
        .get("/allbookingadmin")
        .then((response) => {
          setAllbooking(response.data); // Store the fetched bookings in state
        })
        .catch((error) => {
          console.error("Error fetching bookings:", error); // Log any error
        });
    }
    else {
      // Fetch all bookings from the server
      axios
        .get("/allbooking")
        .then((response) => {
          setAllbooking(response.data); // Store the fetched bookings in state
        })
        .catch((error) => {
          console.error("Error fetching bookings:", error); // Log any error
        });
    }
  }, [user, navigate]);

  // Prevent rendering if user is not logged in

  // Format timestamp to readable date

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  if (user === null) {
    return null;
  } else if (user.admin) {
    return (
      <div className="all-booking-container">
        <h1>All Bookings</h1>

        {Allbooking ? (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Arena Name</th>
                <th>Arena Address</th>
                <th>Arena City</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Booker Name</th>
                <th>Booker Number</th>
                <th>OTP</th>
              </tr>
            </thead>
            <tbody>
              {Allbooking.length > 0 ? (
                // Render each booking in a table row
                Allbooking.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.arena_id.arena_name}</td>
                    <td>{booking.arena_id.address}</td>
                    <td>{booking.arena_id.city}</td>
                    <td>{formatDate(booking.start_time)}</td>
                    <td>{formatTime(booking.start_time)}</td>
                    <td>{formatDate(booking.end_time)}</td>
                    <td>{formatTime(booking.end_time)}</td>
                    <td>{booking.name}</td>
                    <td>{booking.phone_number}</td>
                    <td>{booking.one_time_password}</td>
                  </tr>
                ))
              ) : (
                // Show this message if no bookings are available
                <tr>
                  <td colSpan="7">No bookings available.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          // Show loading message while fetching bookings
          <p>Loading...</p>
        )}
      </div>
    );
  }
  else {
    return (
      <div className="all-booking-container">
        <h1>All Bookings</h1>

        {Allbooking ? (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Arena Name</th>
                <th>Arena Address</th>
                <th>Arena City</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {Allbooking.length > 0 ? (
                // Render each booking in a table row
                Allbooking.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.arena_id.arena_name}</td>
                    <td>{booking.arena_id.address}</td>
                    <td>{booking.arena_id.city}</td>
                    <td>{formatDate(booking.start_time)}</td>
                    <td>{formatTime(booking.start_time)}</td>
                    <td>{formatDate(booking.end_time)}</td>
                    <td>{formatTime(booking.end_time)}</td>
                  </tr>
                ))
              ) : (
                // Show this message if no bookings are available
                <tr>
                  <td colSpan="7">No bookings available.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          // Show loading message while fetching bookings
          <p>Loading...</p>
        )}
      </div>
    );
  }
}
