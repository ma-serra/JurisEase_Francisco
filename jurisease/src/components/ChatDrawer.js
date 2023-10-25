import './ChatDrawer.css'
import React, { useState } from 'react';
import Search from './Search';

function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`content-drawer ${isOpen ? 'open' : 'close'}`}>
        <button className="close-button" onClick={toggleDrawer}>
          X
        </button>
        <h1>Chat Menssager</h1>
        <Search />
        
        <div className="chat-content">

        </div>
      </div>

      <button className="chat-button" onClick={toggleDrawer}>

      </button>
    </div>
  );
}

export default ChatDrawer;
