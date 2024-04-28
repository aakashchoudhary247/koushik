
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import SendIcon from '@mui/icons-material/Send';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PhotoPicker from "../components/PhotoPicker";
import { addImageMessageRoute } from "../utils/APIRoutes";
import axios from "axios";

export default function ChatInput({handleSendMsg, userInfo, currentChatUser, socket, currentChat, data, messages, setMessages }) {
  // console.log( data);
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [sentImage, setSentImage] = useState(null);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(addImageMessageRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: data._id, data: { data } ,
          to: currentChat._id,
        },
      });
      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: data._id,
          message: response.data.message,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: response.data.message });
        setMessages(msgs);
        setSentImage(response.data.message); // Store sent image to display in chat
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setGrabPhoto(false)
      }
    }
  }, [grabPhoto])

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  return (
    <Container>
      <div className="button-container">
        <div className="emoji" ref={emojiRef}>
          <SentimentSatisfiedAltIcon onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <Picker
                onEmojiClick={handleEmojiClick}
                disableAutoFocus={true}
                disableSkinTonePicker={true}
                native={true}
              />
            </div>
          )}
        </div>
      </div>
      <div className="file-button" onClick={() => setGrabPhoto(true)}>
        <AttachFileIcon sx={{ fontSize: 30 }} />
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <SendIcon />
        </button>
      </form>
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {sentImage && <img src={sentImage} alt="Sent" />} {/* to Display sent image in chat */}
    </Container>
  );
}



// Styling
const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 5% 90%;
  @media screen and (min-width: 480px) {
    grid-template-columns: 5% 5% 70%;
  }
  background-color: #080420;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 20px;
    background-color: #ffffff;
    margin-top: 1px;
    margin-left: 7px;
    margin-right: 7px;
    margin-bottom: 7px;
  position: relative;
  padding: 0 2rem;
  
  .file-button {
    color: #757575;
    cursor: pointer;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      svg {
        font-size: 2.5rem;
        color: #757575;
        cursor: pointer;
      }
      .emoji-picker-container {
        position: absolute;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        border-radius: 20px;
        top: -440px;
        left: 30;
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #ffffff34;
    
    input {
      flex: 1;
      height: 100%;
      background-color: transparent;
      color: #757575;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      cursor: pointer;
      padding: 0.3rem 1rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #d10084;
      border: none;
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }

  // Media queries
  @media (max-width: 720px) {
    .button-container { 
      .emoji-picker-container {
        top: -240px; // Adjust position for smaller screens
      }
    }
  }

  @media (max-width: 480px) {
    .button-container {
      .emoji-picker-container {
        top: -140px; // Adjust position for even smaller screens
      }
    }
  }
`;

