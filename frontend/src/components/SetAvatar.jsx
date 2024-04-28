// //for cloudinary services
// // import { Cloudinary } from "@cloudinary/base";
// // import { AdvancedImage } from "@cloudinary/react";
// // import { CloudinaryImage } from "@cloudinary/url-gen";
// import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IconButton } from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { setAvatarRoute } from "../utils/APIRoutes";
import { Await, useNavigate } from "react-router-dom";
import { registerRoute } from "../utils/APIRoutes";

export default function SetAvatar(){
  const api = "https://api.multiavatar.com/46478955 ";
  const navigate = useNavigate();
  const [avatars,setAvatars] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const [selectedAvatar,setSelectedAvatar] = useState(undefined);
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const dropdownRef = useRef(null);

  const handleClickmenuitem = (e, callback) => {
    e.stopPropagation();
    setShowDropdown(false);
  }

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const checkLocalStorage = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      }
    };
  
    checkLocalStorage();
  }, []);
  

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const requests = Array.from({ length: 4 }, (_, i) =>
        axios.get(`${api}/${Math.round(Math.random() * 1000)}`)
      );

      try {
        const responses = await axios.all(requests);
        const data = await Promise.all(
          responses.map((response) => {
            const buffer = new Buffer(response.data);
            return buffer.toString("base64");
          })
        );

        setAvatars(data);
        setIsLoading(false);
      } 
      catch (error) {
        // Handle errors if needed
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedAvatar(index)} >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"/>
                </div>
              );
            })}
          </div>
          {uploadedImage && (
  <div className="avatars">
    {avatars.map((avatar, index) => (
      <div
        className={`avatar ${
          selectedAvatar === index ? "selected" : ""
        }`}
        key={index}
        onClick={() => setSelectedAvatar(index)}
      >
        <img src={uploadedImage} alt="Uploaded Image" />
      </div>
    ))}
  </div>
)}

          <div>
            <h1 className="orr">OR</h1>
            <h1 className="or">TAKE A PICTURE/UPLOAD ONE FROM GALLERY</h1>
            <div className="dropdown-container" ref={dropdownRef}>
              <IconButton onClick={handleDropdownToggle}>
                <PhotoCameraIcon  sx={{ fontSize: 40 }} />
              </IconButton>
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">Take Photo</div>
                  <label htmlFor="upload-photo" className="dropdown-item">
                    Upload Photo
                    <input
                      type="file"
                      id="upload-photo"
                      style={{ display: "none" }}
                      onChange={handleUploadPhoto}
                    />
                  </label>
                  <div className="dropdown-item">Remove Photo</div>
                </div>
              )}
            </div>
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #f0f0f0;
  height: 100vh;
  width: 100vw;
  font-family: 'Times New Roman', Times, serif;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: #333;
      font-size: 2.5rem;
    }
    h3 {
      color: #333;
      font-size: 2.5rem;
    }
  }
  .avatars {
    display: flex;
    flex-wrap: wrap; /* Wrap avatars to next line on small screens */
    gap: 2rem;

    .avatar {
      border: 0.2rem solid #333;
      padding: 0.4rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        width: 6rem;
        border-radius: 50%;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.2rem solid #4e0eff;
    }
  }
  .or {
    color: #333;
    font-size: 2rem;
  }
  .orr{
    color: #333;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center; 
  }
  .dropdown-container {
   display: flex;
   justify-content: center;
  }
  .dropdown-menu {
    position: absolute;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%); /* Center dropdown horizontally */
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    z-index: 1;
  }
  .dropdown-item {
    padding: 10px 20px;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #6245b5;
    }
  }
  // Add media query for 480px screens
@media screen and (max-width: 480px) {
  .dropdown-container {
    margin-left: auto;
    margin-right: auto;
  }
  .orR{
    color: #333;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .avatars {
    justify-content: center;
  }
}
`;

    const UploadedImageContainer = styled.div`
    
    display: flex;
    gap: 2rem;
    `;
    const UploadedImage = styled.div`
    border: 0.2rem solid #333;
    padding: 0.4rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;
    `;
