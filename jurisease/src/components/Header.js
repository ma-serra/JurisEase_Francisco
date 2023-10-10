import React, { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

function Header({ orientation }) {

    // button login
    const [isLoginOpen, setLoginOpen] = useState(false);
    const toggleLogin = () => {
        setLoginOpen(!isLoginOpen);
    };

    // lupa
    const [busca, setBusca] = useState("");
    const [showSearch, setShowSearch] = useState(true);

    useEffect(() => {

        function handleResize() {
            setShowSearch(!!(window.screen.width > 500));
            console.log(window.screen.width)
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, []);

    return (
        <header className={`header ${orientation}`}>

            <div className="header-content-left">
                <div >
                    <img className="logo" src="/logo.png" alt="Logo do Meu Site" />
                </div>
                <div >
                    <p className="title">Juris Ease</p>
                </div>
            </div>

            <div className="header-content-right">
                <div className="header-search">
                    {showSearch && (
                       <input
                        type="text"
                        placeholder="Filtrar..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    /> 
                    )}
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