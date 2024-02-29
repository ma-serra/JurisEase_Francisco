import './ChatDrawer.css'
import React, { useState } from 'react';

import Search from '../Search/Search';

function ChatDrawer({ device }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`content-chat-drawer ${device}`}>
      <div className={`content-drawer ${isOpen ? 'open' : 'close'}`}>
        <button className="close-button" onClick={toggleDrawer}>
          X
        </button>
        <h1>Chat Menssager</h1>
        <Search />
        
        <div className="chat-content">
          <p>Em desenvolvimento</p>
        </div>
      </div>

      <button className="chat-button" onClick={toggleDrawer}>

      </button>
    </div>
  );
}

export default ChatDrawer;
