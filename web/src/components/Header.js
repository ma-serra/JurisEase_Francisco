import './Header.css'
import React, { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import Search from '../components/Search';

function Header({ orientation, device, openAuth }) {

    // button login
    const [isLoginOpen, setLoginOpen] = useState(false);
    const toggleLogin = () => {
        setLoginOpen(!isLoginOpen);
    };

    // lupa
    const [showSearch, setShowSearch] = useState(true);

    useEffect(() => {

        function handleResize() {
            setShowSearch(!!(window.screen.width > 500));
        }

        handleResize()

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, []);

    return (
        <header className={`header ${orientation} ${device}`}>

            <div className="header-content-left">
                <div >
                    <img className="logo" src="images/logo.png" alt="Logo do Meu Site" />
                </div>
                <div >
                    <p className="title">Juris Ease</p>
                </div>
            </div>

            <div className="header-content-right">
                <div className="header-search">
                    {showSearch && 
                       <Search />
                    }
                </div>

                <div className="header-login">
                    <button onClick={toggleLogin} className="login-button">
                        Login <FaCaretDown />
                    </button>
                    {isLoginOpen && (
                        <div className="login-options">
                            <p onClick={openAuth} >Cliente</p>
                            <p onClick={openAuth} >Advogado</p>
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