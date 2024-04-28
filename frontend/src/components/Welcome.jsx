
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot1.gif";
import Logout from "./Logout";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserName(userData.username);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    
   
    
    <Container>
      <div className="logout">
      <Logout />
      </div>
      <div>
      <img src={Robot} alt="welcome" />
      <h1>
        Welcome, <br /><span>{userName}!</span>
      </h1>
      <h3 >Select a chat and start messaging.</h3>
      </div>
    </Container>
    
  );
}

const Container = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 90vh; /* Ensures container covers entire viewport height */
  width: 60vw;
  border-radius:20px;
 
  .logout {
    position: absolute;
    top: 30px;
    right: 50px;
  }
  
  img {
    height: 20rem;
    justify-self: center; /* Centers image horizontally */
  }

  h1 {
    text-align: center; /* Centers text horizontally */
    margin-top: 20px; /* Adds space above the h1 element */
  }

  span {
    color: #b3003e;
  }

  h3 {
    text-align: center; /* Centers text horizontally */
  }

  /* Media queries for tablet */
  @media (max-width: 768px) {
    img {
      height: 15rem;
    }
  }

  /* Media queries for mobile */
  @media (max-width: 480px) {
    img {
      height: 10rem;
    }
    h1 {
      font-size: 1.5rem;
    }
    h3 {
      font-size: 1rem;
    }
  }
`;
