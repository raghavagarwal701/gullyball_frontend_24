import React, { useEffect, useState } from 'react';
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Mybooking.css"

export default function MyBooking() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); 
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user === null) {
      navigate("/"); 
    } else {
      axios.post('/currentbooking', {player_id: user.player_id})
        .then(response => {
          setBookings(response.data);
        })
        .catch(error => {
          console.error('Error fetching bookings:', error);
        });
    }
  }, [user, navigate]);

  if (user === null) {
    return null; 
  }

  return (
    <div>
      <h1>My Bookings</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Starting Time</th>
            <th>Game Format</th>
            <th>Arena Name</th>
            <th>Arena Address</th>
            <th>City</th>
            <th>OTP</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => {
            const date = new Date(booking.date_time * 1000);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString();

            return (
              <tr key={index}>
                <td>{dateString}</td>
                <td>{timeString}</td>
                <td>{booking.game_format_id}</td>
                <td>{booking.arena_id.arena_name}</td>
                <td>{booking.arena_id.address}</td>
                <td>{booking.arena_id.city}</td>
                <td>{booking.otp_web}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
