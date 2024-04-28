import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
 
  


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userString = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
        if (!userString) {
          navigate("/login");
        } else {
          const user = await JSON.parse(userString);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
  
    fetchCurrentUser();
  }, [navigate]);
  
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser && currentUser.isAvatarImageSet) {
        try {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      } else if (currentUser) {
        navigate("/setAvatar");
      }
    };
  
    fetchContacts();
  }, [currentUser, navigate]);
  
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>

  

      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

// chat container background color - #0d1a1a
// chat header - #121f1f
// input chat - #0d1a1a
// contacts/ sidebar - #393e3d
// search box - #0d1a1a
// send button - #13ce8f
// on click black theme - text white/button sun
// on click white theme - text black/button moon 

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  // flex-direction: column;
  // justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #e7e6e8;

  .container {
    border-radius: 20px;
    height: 98vh;
    // width: 99vw;
    width: 99%;
    background-color: #f8f9fc;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    display: grid;
    grid-template-columns: 20% 80%;

    @media screen and (min-width: 720px){
      grid-template-columns: 30% 69%;
    }
    @media screen and (min-width: 480px){
      grid-template-columns: 20% 79%;
    }
  }
`;

