//login form for the existing user if the user doesnt exist it shows popup error
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
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
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>connect</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
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
  background-color: #f9f9f9;
   
  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    img {
      height: 120px;
    }
    h1 {
      color: #4e0eff;
      font-family: 'Arial', sans-serif;
      text-transform: uppercase;
      font-size: 2.5rem;
    }  
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #fff;
    border-radius: 2rem;
    padding: 3rem 5rem;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  }

  input {
    background-color: #f5f5f5;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 2rem;
    color: #333;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border-color: #4e0eff; 
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 2rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: background-color 0.3s;
    &:hover {
      background-color: #6245b5;
    }
  }

  span {
    color: #555;
    font-size: 0.9rem; 
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s;
      &:hover {
        color: #6245b5;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    /* for tablets */
    FormContainer {
      padding: 2rem;
    }
  
    .brand {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
  
    img {
      height: 80px;
    }
  
    h1 {
      font-size: 2rem;
      text-align: center;
    }
  
    form {
      padding: 2rem;
    }
  
    button {
      padding: 0.8rem 1.5rem;
    }
  }
  
  @media only screen and (max-width: 480px) {
    /* for mobile */
    FormContainer {
      padding: 1rem;
    }
  
    .brand {
      img {
        height: 60px;
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
    }
  
    button {
      padding: 0.8rem 1.2rem;
      font-size: 0.9rem;
    }
  }
  
`;

