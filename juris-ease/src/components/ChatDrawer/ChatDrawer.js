import './ChatDrawer.css'
import React, { useState } from 'react';
import { RiChat1Fill } from "react-icons/ri";

function ChatDrawer() {

    const [open, setOpen] = useState(false)

    return (
        <div className='ChatDrawer'>
            <div className='content-header' onClick={() => { setOpen(!open) }}>
                <p className='title'>Mensagens </p>
                <RiChat1Fill className='icon-chat' />
            </div>

            {open && (
                <div className='content-chat'></div>
            )}
            
        </div >
    );
}

export default ChatDrawer;
