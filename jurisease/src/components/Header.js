import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

function Header() {
    const [isLoginOpen, setLoginOpen] = useState(false);

    const toggleLogin = () => {
        setLoginOpen(!isLoginOpen);
    };

    return (
        <header className="header">
            <div className="header-content-left">
                <div >
                    <img className="logo" src="/logo.png" alt="Logo do Meu Site" />
                </div>
                <div >
                    <h1>Juris Ease</h1>
                </div>
            </div>
            <div className="header-content-right">
                <div className="login-container">
                    <button onClick={toggleLogin} className="login-button">
                        Login <FaCaretDown />
                    </button>
                    {isLoginOpen && (
                        <div className="login-options">
                            <p>Cliente</p>
                            <p>Advogado</p>
                        </div>
                    )}
                </div>
                <div className='faleconosco-container'>
                    <p>Fale conosco</p>
                </div>
            </div>
        </header>
    );
}

export default Header;