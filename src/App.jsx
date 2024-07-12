import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Mybooking from "./pages/Mybooking";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";
import Allbooking from "./pages/Allbooking";
import Newbooking from "./pages/Newbooking";


// axios.defaults.baseURL = "http://192.168.0.180:4000/api";
// axios.defaults.baseURL = "http://192.168.0.138:4000/api";
// axios.defaults.baseURL = "http://35.154.14.164:8085/api";
axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserContextProvider>
        <Navbar />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/mybooking" element={<Mybooking />} />
          <Route path="/newbooking" element={<Newbooking />} />
          <Route path="/allbooking" element={<Allbooking />} />
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
