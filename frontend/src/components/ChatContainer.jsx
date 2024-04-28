// original
import React, { useState, useEffect, useRef, dispatch, useReducer } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { IconButton } from "@mui/material";
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

import { reducerCases } from "../context/constants";
// import  Menu1  from "./Menu1";

// Define reducer function
function reducer(state, action) {
  switch (action.type) {
    case reducerCases.SET_VOICE_CALL:
      return { ...state, voiceCall: action.payload };
    case reducerCases.SET_VIDEO_CALL:
      return { ...state, videoCall: action.payload };
    default:
      return state;
  }
}

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [{ videoCall, voiceCall, incomingVoiceCall, incomingVideoCall}] = useState({ videoCall: undefined, voiceCall: undefined, incomingVoiceCall: undefined, incomingVideoCall: undefined });

  // Initialize state with useReducer
  const [state, dispatch] = useReducer(reducer, {
    videoCall: null,
    voiceCall: null,
    incomingVoiceCall: null,
    incomingVideoCall: null
  });
  

const MessageStatus = {
  SENT: 'sent', // Single tick
  DELIVERED: 'delivered', // Double tick
  READ: 'read' // Blue tick
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        if (data && data._id && currentChat && currentChat._id) {
          const response = await axios.post(recieveMessageRoute, {
            from: data._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchData();
  }, [currentChat]);
  
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };
  const handleVoiceCall = () => {
    dispatch({type:reducerCases.SET_VOICE_CALL,
    voiceCall:{
      ...currentChat,
      type:"out-going",
      callType:"voice",
      roomId: Date.now(),
    }})
  }

  const handleVideoCall = () => {
    dispatch({type:reducerCases.SET_VIDEO_CALL,
    videoCall:{
      ...currentChat,
      type:"out-going",
      callType:"video",
      roomId: Date.now(),
    }})
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>

    {
      videoCall && (<div className="h-screen w-screen max-h-full overflow-hidden">
        <videoCall />
      </div>
    )}

{
      voiceCall && (<div className="h-screen w-screen max-h-full overflow-hidden">
        <voiceCall />
      </div>
    )}

    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <div>
        <IconButton className = "Voicecall-button" onClick={handleVoiceCall}>
          <CallIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <IconButton onClick={handleVideoCall}>
          <VideoCallIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <IconButton>
          <Logout />
          </IconButton>
          </div>
          
        </div>
       <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto; /* Adjusted grid-template-rows */
  border-radius: 20px;
  gap: 0.1rem;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  .chat-header {
    display: flex;
    border-radius: 20px;
    margin: 7px;
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    // justify-content: space-between;
    align-items: center;
    padding: 0.5; /* Adjusted padding */
    @media screen and (min-width: 720px) { /* Media query for tablet devices */
      padding: 0 2rem; /* Adjust padding for tablet devices */
    }
    @media screen and (min-width: 480px) { /* Media query for mobile devices */
      padding: 0.5rem; /* Adjust padding for mobile devices */
    }
    .user-details {
      display: flex;
      align-items: center;  
      gap: 0.5rem; /* Adjusted gap for mobile devices */
      .avatar {
        img {
          // height: 3rem;
          height: 2rem; /* Adjusted avatar size for mobile devices */
          @media screen and (min-width: 720px) { /* Media query for tablet devices */
            height: 4rem; /* Adjust avatar size for tablet devices */
          }
          @media screen and (min-width: 480px) { /* Media query for mobile devices */
            // height: 2.5rem; /* Adjust avatar size for mobile devices */
            height: 3rem; /* Adjusted avatar size */
            width: 7rem; /* Adjusted avatar size */
            border-radius: 50%; /* Rounded avatar */
          }
        }
      }
      .username {
        h3 {
          color: #757575 ;
          font-size: 1rem; /* Adjusted font size for mobile devices */
          @media screen and (min-width: 480px) { /* Media query for mobile devices */
            font-size: 1.2rem; /* Adjust font size for mobile devices */
          }
        }
      }
    }
    .MuiIconButton-root {
      padding: 0.5rem; /* Adjust padding for icon buttons */
      @media screen and (min-width: 720px) { /* Media query for tablet devices */
        padding: 1rem; /* Adjust padding for tablet devices */
      }
      @media screen and (min-width: 480px) { /* Media query for mobile devices */
      padding: 0.8rem; /* Adjust padding for mobile devices */
    }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 20px;
    margin-top: 7px;
    margin-left: 7px;
    margin-right: 7px;
    margin-bottom: 7px;
    gap: 0.5rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 0.5rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #000000;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
        @media screen and (min-width: 480px) and (max-width: 720px) {
          max-width: 50%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      @media screen and (min-width: 480px) and (max-width: 720px) {
        justify-content: flex-start;
      }
      .content {
        background-color: #ff2b77; 
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #02c39a; 
      }
    }
  }
`