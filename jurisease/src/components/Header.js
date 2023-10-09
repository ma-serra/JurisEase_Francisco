import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

function Header() {

    const [isLoginOpen, setLoginOpen] = useState(false);
    const toggleLogin = () => {
        setLoginOpen(!isLoginOpen);
    };

    const [busca, setBusca] = useState("");

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

                <div class="header-search">

                    <input 
                        type="text"
                        placeholder="Filtrar..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />

                </div>

                <div className="header-login">
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

                <div className='header-faleconosco'>
                    <p>Fale conosco</p>
                </div>

            </div>
        </header>
    );
}

export default Header;