import { NavLink } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {
  return (
    <nav>
      {/* <NavLink exact to="/" activeClassName="active">Login</NavLink> */}
      <NavLink to="/mybooking" activeClassName="active">My Booking</NavLink>
      <NavLink to="/newbooking" activeClassName="active">New Booking</NavLink>
      <NavLink to="/allbooking" activeClassName="active">All Booking</NavLink>
    </nav>
  );
}
