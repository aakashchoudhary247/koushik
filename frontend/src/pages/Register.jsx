import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
    const navigate = useNavigate();
    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };
    const [values, setValues] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  
    useEffect(() => {
      if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/");
      }
    }, []);
  
    const handleChange = (event) => {
      setValues({ ...values, [event.target.name]: event.target.value });
    };
  
    const handleValidation = () => {
      const { password, confirmPassword, username, email } = values;
      if (password !== confirmPassword) {
        toast.error(
          "Password and confirm password should be same.",
          toastOptions
        );
        return false;
      } else if (username.length < 3) {
        toast.error(
          "Username should be greater than 3 characters.",
          toastOptions
        );
        return false;
      } else if (password.length < 8) {
        toast.error(
          "Password should be equal or greater than 8 characters.",
          toastOptions
        );
        return false;
      } else if (email === "") {
        toast.error("Email is required.", toastOptions);
        return false;
      }
  
      return true;
    };
  
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (handleValidation()) {
        const { email, username, password } = values;
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });
  
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(data.user)
          );
          navigate("/");
        }
      }
    }
    return (
    <>
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className="brand">
                <img src={Logo} alt="Logo" />
                <h1>connect</h1>
               
            </div>
            <input type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)} 
            />
            <input type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)} 
            />
            <input type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)} 
            />
            <input type="tpassword"
            placeholder="Comfirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)} 
            />
            <button type="submit">Create User</button>
            <span>
                already have an account ? <Link to="/login">Login</Link>
            </span>
        </form>
    </FormContainer>
    <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #6a75aa; 
  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    img {
      height: 120px;
    }
    h1 {
      color: #fff;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #ffc300;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.01rem solid #fff;
    border-radius: 2rem;
    color: #fff; 
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #ff5722;
      outline: none;
    }
  }
  button {
    background-color: #ff5722; 
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 2rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #009688; /* Changed hover background color */
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #ff5722; /* Changed link color */
      text-decoration: none;
      font-weight: bold;
    }
  }
  
  @media only screen and (max-width: 768px) {
    /* Adjust form container layout for tablets */
    FormContainer {
      padding: 2rem;
    }
  
    .brand {
      img {
        height: 80px;
      }
      h1 {
        font-size: 1.8rem;
      }
    }
  
    form {
      padding: 2rem;
    }
  
    input {
      padding: 0.8rem;
      font-size: 0.9rem;
      background-color: #f5f5f5;
      border: 1px solid #ccc;
      color: #333;
    }
  
    button {
      padding: 0.8rem 1.5rem;
      font-size: 0.9rem;
      background-color: #4e0eff;
      color: white;
      border: none;
      transition: background-color 0.3s;
    }
  
    button:hover {
      background-color: #6245b5;
    }
  }
  
  @media only screen and (max-width: 480px) {
    /* Adjust form container layout for mobile */
    FormContainer {
      padding: 1rem;
    }
  
    .brand {
      img {
        height: 60px;
      }
      h1 {
        font-size: 1.5rem;
      }
    }
  
    form {
      padding: 2rem;
    }
  
    input {
      padding: 0.6rem;
      font-size: 0.8rem;
      background-color: #f5f5f5;
      border: 1px solid #ccc;
      color: #333;
    }
  
    button {
      padding: 0.6rem 1rem;
      font-size: 0.8rem;
      background-color: #4e0eff;
      color: white;
      border: none;
      transition: background-color 0.3s;
    }
  
    button:hover {
      background-color: #6245b5;
    }
  }
  
`;
