// in this information of the users present in a column in the left where we can select the user to chat
import React, { useState, useEffect, useDebugValue } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
//for material ui icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const dispatch = useDispatch();
  const [lightTheme, setLightTheme] = useState(true);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
      } catch (error) {
        console.error('Error fetching data from localStorage:', error);
      }
    };
  
    fetchData();
  }, []);

  // Function to filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  
  const toggleTheme = () => {
    setLightTheme(prevTheme => !prevTheme); // Toggle between light and dark themes
  };

  // const theme = {
  //   light: {
  //     background: "#f8f9fc",
  //     text: "#393e3d",
  //     icon: "whitesmoke",
  //     boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  //     // Add more light theme properties as needed
  //   },
  //   dark: {
  //     background: "#393e3d",
  //     text: "whitesmoke",
  //     icon: "#393e3d",
  //     boxShadow: "rgba(255, 255, 255, 0.35) 0px 5px 15px",
  //     // Add more dark theme properties as needed
  //   }
  // };
  

return (
  <>
    {currentUserImage && currentUserImage && (
      <Container>
        <div className={"brand " + ((lightTheme)?"" : "black")}>
          <div>
          <IconButton className={"icon " + ((lightTheme)?"" : "black")} >
          <AccountCircleIcon />
          </IconButton>
          </div>
          <div>
          <IconButton className={"icon " + ((lightTheme)?"" : "black")}>
          <PersonAddIcon />
          </IconButton>
          <IconButton className={"icon " + ((lightTheme)?"" : "black")}>
          <GroupAddIcon />
          </IconButton>
          <IconButton  onClick={()=>{setLightTheme((prevValue) => {
            return !prevValue;
          })}} className="dark-mode-icon">
            { lightTheme && <DarkModeIcon className={"icon " + ((lightTheme)?"" : "black")}/> }
            { !lightTheme && <LightModeIcon className={"icon " + ((lightTheme)?"" : "black")}/> }
          </IconButton>
         
          </div>
        </div>
        <div className="search-bar">
          <IconButton >
          <SearchIcon/>
          </IconButton>
          <input placeholder="Search" className="search-box" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="contacts">
        
          {filteredContacts.map((contact, index) => {
            return (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                  />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                  
                </div>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentUserImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h2>{currentUserName}</h2>
          </div>
        </div>
      </Container>
    )}
  </>
);
}


const Container = styled.div`
display: grid;
grid-template-rows: 10% 5% 73% 12%;
overflow: hidden;
background-color:: #f8f9fc;

.dark-mode-icon:hover::before {
  content: "Change Theme";
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px;
  border-radius: 5px;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  white-space: nowrap;
}


.black {
  background-color: #393e3d !important;
  color: whitesmoke !important;
}
.icon {

}

.brand {
  
  background-color: #ffffff;
  border-radius: 20px;
  display: flex;
  margin:4px;
  padding: 10px 5px;
  gap: 1.5rem;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
 
}

.search-bar {
  background-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  
  border-radius: 20px;
  padding: 10px 5px;
  margin-top: 5px;
  margin-left:4px;
  margin-right: 4px;
  display: flex;
  align-items: center;
}
.search-box {
  outline-width:0;
  border: #757575;
  font-size: 1rem;
  margin : 10px;
}
.contacts {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  margin:4px;
  gap: 0.4rem;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .contact {
    background-color: #ffffff34;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    min-height: 5rem;
    cursor: pointer;
    width: 99%;
    border-radius: 20px;
    padding: 0.5rem;
    display: flex;
    gap: 0.3rem;
    align-items: center;
    transition: 0.5s ease-in-out;
    
    .avatar {
      img {
        height: 3rem;
        max-inline-size: 100%;
        
      }
    }
    .username {
      h3 {
        color: #757575;
        max-inline-size: 100%;
      }
      h6 {
        color: white;
        max-inline-size: 100%;
      }
    }
  }
  .contact:hover{
    background-color: #9a83;
  }
  .selected {
    background-color: #ace2e1;
  }
}

.current-user {
  background-color: #ace2e1;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  border-radius:20px;
  margin: 5px;
  .avatar {
    img {
      height: 3rem;
      max-inline-size: 100%;
      display : flex-start;
    }
  }
  .username {
    h2 {
      color: #757575;
    }
  }
}

background-color: ${({ theme }) => theme.background};
color: ${({ theme }) => theme.text};
// Apply other styles using theme properties

/* Media queries for tablet */
@media screen and (max-width: 720px) {
  .brand {
    img {
      height: 1.5rem;
    }
    h3 {
      font-size: 0.8rem;
    }
  }
  .contacts {
    .contact {
      min-height: 4rem;
      .avatar {
        img {
          height: 2.5rem;
        }
      }
      .username {
        h3 {
          font-size: 0.8rem;
        }
      }
    }
  }
  .current-user {
    border-radius: 20px;
    padding: 0.5rem;
    display: flex;
    gap: 0.3rem;
    align-items: center;
    .avatar {
      img {
        height: 3rem;
      }
    }
    .username {
      h2 {
        font-size: 1rem;
      }
    }
  }
}


@media only screen and (max-width: 40em) {
  grid-template-rows: 85% 15%;
  
  .brand 
  {
    display : none;
  }
  .search-bar
  {
    display : none;
  }
  .search-box
  {
    display : none;
  }
  .contact
  {
    display: flex;
    justify-content: center;
    flex-direction: column;
    
   
  }
  .current-user
  {
    display: flex;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }
}
`;