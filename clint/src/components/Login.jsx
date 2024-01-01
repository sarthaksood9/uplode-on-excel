import React, { useState } from 'react'
import axios from 'axios';



export const EmailCheck = () => {
  const [email, setEmail] = useState("");

  const [loader, setLoader] = useState(false);

  const [emailExistace, setEmailExistace] = useState(false);

  const hendleCheck = async (email) => {
    try {
      setLoader(true);

      const response = await axios.get(`http://localhost:8000/checkemail?email=${email}`);

      setEmailExistace(response.data.exist)
      console.log(response);
    }
    catch (e) {
      console.log(e);
    }
    finally {
      setLoader(false);
    }
  }

  console.log(loader);
  return (
    <>
      <input placeholder="Enter your Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
      <button onClick={() => {
        hendleCheck(email);
      }} >
        check
      </button>

      {emailExistace ? <h1>email Exists</h1> : <h1>email dosn't Exists</h1>}
    </>

  )
}

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loader, setLoader] = useState(false);

  const [emailExistace, setEmailExistace] = useState(false);




  // console.log(name,email,password);


  const hendleCheck = async (email) => {
    try {
      setLoader(true);

      const response = await axios.get(`http://localhost:8000/checkemail?email=${email}`);
      console.log(response.data);
      return response.data.exist;

    }
    catch (e) {
      console.log(e);
    }
    finally {
      setLoader(false);
    }
  }



  const hendleSubmit = async (firstName, lastName, email, password) => {

    setLoader(true);
    const check = await hendleCheck(email);

    if (!check) {
      const obj = { firstName: firstName, lastName: lastName, email: email, password: password };
      axios.post("http://localhost:8000/signup", obj)
        .then(() => {
          console.log("data posted");
          setEmailExistace(false);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoader(false)
        })
    }
    else {
      console.log("email already exist");
    }


  }
  return (
    <div>
      {/* <input placeholder="First Name" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
      <input placeholder="last Name" value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
      <input placeholder="Enter your Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
      <input placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
      <button onClick={() => {
        hendleSubmit(firstName, lastName, email, password);
      }} >login</button>

      <br></br> */}
      <div className='h-screen w-full flex justify-center items-center'>
        <div className='h-[70vh] w-[40vw] shadow-2xl flex gap-[1.5rem] items-center justify-center flex-col px-[3rem] rounded-2xl'>
          <h1>Register</h1>
          <div className='w-full flex flex-col justify-start items-start gap-2'>
            <label className='px-2' htmlFor='name'>Name</label>
            <input value={firstName} onChange={(e) => { setFirstName(e.target.value) }} className='w-full h-8 border-[1px] rounded-3xl px-3' type="text" placeholder='Name' id='name' />
          </div>
          <div className='w-full flex flex-col justify-start items-start gap-2'>
            <label className='px-2' htmlFor='email'>Email</label>
            <input value={email} onChange={(e) => { setEmail(e.target.value) }} className='w-full h-8 border-[1px] rounded-3xl px-3' type="text" placeholder='Email' id='email' />
          </div>
          <div className='w-full flex flex-col justify-start items-start gap-2'>
            <label className='px-2' htmlFor='password'>Password</label>
            <input value={password} onChange={(e) => { setPassword(e.target.value) }} className='w-full h-8 border-[1px] rounded-3xl px-3' type="text" placeholder='Enter Password' id='password' />
          </div>
          <div className='w-full' onClick={() => {
            hendleSubmit(firstName, lastName, email, password);
          }}>
            <button className='w-full py-2 text-white border-[2px] rounded-3xl bg-sky-600'>Sign Up</button>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Login