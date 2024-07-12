import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useEffect } from "react";
import './Login.css'

function Login() {
  const navigate = useNavigate(); //importing navigation

  const { user, setUser } = useContext(UserContext); //checking if user is logged in
  useEffect(() => {
    if (user !== null) {
      navigate("/mybooking"); // Returning to login page if not logged in
    }
  }, [user, navigate]);

  const [user_data, setuser_data] = useState({
    //definig data structure
    login_id: "",
    login_password: "",
  });

  const loginuser = async (e) => {
    //funtion to call api
    e.preventDefault(); //preventing reload
    const { login_id, login_password } = user_data;
    try {
      const responce = await axios.post("/login", {
        //calling api
        login_id,
        login_password,
      });
      if (responce.data.error) {
        //checking reponce message
        toast.error(responce.data.error);
      } else {
        // console.log(responce)
        setUser(responce.data);
        setuser_data({});
        navigate("/mybooking"); //going to myboooking if login sucessfull
        toast.success("Login sucessful, Welcome!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  if (user !== null) {
    return null; // Prevent rendering login form if user is already logged in
  }
  return (
    <>
      <form onSubmit={loginuser}>
        <label>Phone Number or Email</label>
        <input
          type="text"
          placeholder="enter your email or phone number....."
          value={user_data.login_id}
          onChange={(e) =>
            setuser_data({ ...user_data, login_id: e.target.value })
          }
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="enter your password....."
          value={user_data.login_password}
          onChange={(e) =>
            setuser_data({ ...user_data, login_password: e.target.value })
          }
        />
        <button type="submit">login</button>
      </form>
    </>
  );
}

export default Login;
