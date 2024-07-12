import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate()
  const [user_data, setuser_data] = useState({
    user_name: '',
    user_number: '',
    user_mail: '',
    user_password: '',
  })
  
  const signupuser = async (e) =>{
    e.preventDefault()
    const {user_name, user_number, user_mail, user_password} = user_data;
    try {
      // console.log(user_name)
      const responce = await axios.post('/signup', {
        user_name, user_number, user_mail, user_password
      })
      if(responce.data.error){
        // console.log(responce.data.error)
        toast.error(responce.data.error);
      } 
      else{
        setuser_data({})
        toast.success('Login sucessful, Welcome!')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }


  
  return (
    <>
      <form onSubmit={signupuser}>
        <label>Name</label>
        <input type="text" placeholder="enter your name....." value = {user_data.user_name} onChange={(e) => setuser_data({...user_data, user_name: e.target.value})}/>
        <label>Email</label>
        <input type="email" placeholder="enter your mail....." value = {user_data.user_mail} onChange={(e) => setuser_data({...user_data, user_mail: e.target.value})}/>
        <label>Number</label>
        <input type="text" placeholder="enter your number....." value = {user_data.user_number} onChange={(e) => setuser_data({...user_data, user_number: e.target.value})}/>
        <label>Password</label>
        <input type="password" placeholder="enter your password....." value = {user_data.user_password} onChange={(e) => setuser_data({...user_data, user_password: e.target.value})}/>
        <button type="submit">Signup</button>
      </form>
    </>
  );
}

export default Signup;
