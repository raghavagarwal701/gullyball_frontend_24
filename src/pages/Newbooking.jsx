import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Newbooking.css";


export default function Newbooking() {
  const { user } = useContext(UserContext); // Taking user data from token
  const navigate = useNavigate(); // Importing navigation
  const [Initial_data, setInitial_data] = useState(null);
  const [selectedCity, setSelectedCity] = useState(""); // State for selected city
  const [selectedArena, setSelectedArena] = useState(""); // State for selected arena
  const [selectedFormat, setSelectedFormat] = useState(""); // State for selected format
  const [selectedDateTime, setSelectedDateTime] = useState(""); // State for selected date and time
  const [Baseprise, setBaseprise] = useState(""); //state for base prise
  const [Walletbalance, setWalletbalance] = useState(""); //state for wallet balance
  const [useWalletBalance, setUseWalletBalance] = useState(false); // State for using wallet balance
  const [Available_slot, setAvailable_slot] = useState(false);

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay SDK loaded');
      };
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);


  useEffect(() => {
    if (user === null) {
      navigate("/");
    } else {
      //getting initial arena and format data
      axios
        .get("/newbookinginitialdata")
        .then((response) => {
          setInitial_data(response.data);
        })
        .catch((error) => {
          console.error("Error fetching initial data", error);
        });

      //getting wallet balance
      axios
        .post("/walletbalance", { player_id: user.player_id })
        .then((response) => {
          setWalletbalance(response.data[0].balance);
        })
        .catch((error) => {
          console.error("Error fetching wallet balance:", error);
        });
    }
  }, [user, navigate]);

  //getting the base prise from arena id
  useEffect(() => {
    if (selectedArena && selectedFormat) {
      const temp = Initial_data?.arena?.filter(
        (arena) => arena.arena_id === Number(selectedArena)
      );

      const temp1 = Initial_data?.format?.filter(
        (format) => format.gt_id === Number(selectedFormat)
      );
      setBaseprise((temp[0].base_price * temp1[0].duration) / 3600);
    }
  }, [selectedArena, Initial_data, selectedFormat]);

  //checking slot availality
  useEffect(() => {
    if (selectedArena && selectedDateTime && selectedFormat) {
      axios
        .post("/checkslot", {
          arena_id: selectedArena,
          start_time: selectedDateTime,
          format: selectedFormat,
        })
        .then((responce) => {
          if (responce.data.errmessage) toast.error(responce.data.errmessage);
          else toast.success(responce.data.message);
          setAvailable_slot(responce.data.isavailable);
        });
    }
  });

  // Get unique cities from the arena data
  const cities = Initial_data?.arena
    ?.map((arena) => arena.city)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Get arenas based on the selected city
  const arenas = Initial_data?.arena?.filter(
    (arena) => arena.city === selectedCity
  );

  // Get current date and time in proper format for datetime-local input
  const now = new Date();
  const nowFormatted = now.toISOString().slice(0, 16);

  // Function to handle payment
  const handlePayment = async () => {
    if (useWalletBalance) {
      if (Walletbalance >= 0.25 * Baseprise) {
        await axios
          .post("./newbookingfromwallet", {
            player_id: user.player_id,
            booking_price: 0.25 * Baseprise,
            booking_time: selectedDateTime,
            arena_id: selectedArena,
            format: selectedFormat,
          })
          .then((responce) => {
            console.log(responce);
          })
          .catch((error) => {
            console.error("Error fetching wallet balance:", error);
          });
        axios
          .post("/walletbalance", { player_id: user.player_id })
          .then((response) => {
            setWalletbalance(response.data[0].balance);
          })
          .catch((error) => {
            console.error("Error fetching wallet balance:", error);
          });
      }else{
        toast.error("Insufficinet Wallet Balance")
      }
    }
    else{
      const razoroptions = await axios.post("./createorderrazor", {
        amount: 25*Baseprise,
        player_id: user.player_id
      })
      .catch((error) =>{
        console.error("Error getting razore pay order")
      })
      // console.log(razoroptions.data);
      const rzp1 = new window.Razorpay(razoroptions.data);
      rzp1.open();
    }
  };

  if (user === null) {
    return null;
  }

  return (
    <div>
      <h2>New Booking</h2>
      {/* This is for selecting city*/}
      <div>
        <label htmlFor="city">Select City:</label>
        <select
          id="city"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cities?.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* This is for selecting arena*/}
      <div>
        <label htmlFor="arena">Select Arena:</label>
        <select
          id="arena"
          value={selectedArena}
          onChange={(e) => setSelectedArena(e.target.value)}
          disabled={!selectedCity}
        >
          <option value="">Select Arena</option>
          {arenas?.map((arena) => (
            <option key={arena.arena_id} value={arena.arena_id}>
              {arena.arena_name}
            </option>
          ))}
        </select>
      </div>

      {/* This is for selecting format*/}
      <div>
        <label htmlFor="format">Select Format:</label>
        <select
          id="format"
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
        >
          <option value="">Select Format</option>
          {Initial_data?.format?.map((format) => (
            <option key={format.gt_id} value={format.gt_id}>
              {format.gameformat_name}
            </option>
          ))}
        </select>
      </div>

      {/* This is for selecting time*/}
      <div>
        <label htmlFor="datetime">Select Date and Time:</label>
        <input
          type="datetime-local"
          id="datetime"
          value={selectedDateTime}
          onChange={(e) => setSelectedDateTime(e.target.value)}
          min={nowFormatted} // Restrict to future dates and times
          placeholder="Select a date and time"
        />
      </div>

      <div>
        {Baseprise !== null && (
          <p>
            The Advance Booking Fees (non-refundable) is: ₹{0.25 * Baseprise}/-
          </p>
        )}
      </div>
      <div>
        {Baseprise !== null && (
          <p>The Booking Fees is: ₹{Baseprise}/- To be paid at the Arena</p>
        )}
      </div>
      <div>
        {Walletbalance !== null && (
          <p>Your Wallet Balance is: ₹{Walletbalance}/-</p>
        )}
      </div>

      {/* Checkbox for using wallet balance */}
      <div className="wallet-balance-container">
        <label htmlFor="useWalletBalance">Use Wallet Balance:</label>
        <input
          type="checkbox"
          id="useWalletBalance"
          checked={useWalletBalance}
          onChange={(e) => setUseWalletBalance(e.target.checked)}
        />
      </div>

      {/* Button for making payment */}
      <div>
        <button onClick={handlePayment} disabled={!Available_slot}>
          Make Payment
        </button>
      </div>
    </div>
  );
}
