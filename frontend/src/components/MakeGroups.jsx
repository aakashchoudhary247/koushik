
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot1.gif";

export default function MakeGroups() {

  return (
    
    
    <Container>
      <div className="logout">
      <Logout />
      </div>  
      <img src={Robot} alt="welcome" />
      <h1>
        Welcome, <br /><span>{userName}!</span>
      </h1>
      <h3 >Select a chat and start messaging.</h3>
    </Container>
    
  );
}