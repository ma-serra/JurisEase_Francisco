import './Header.css'
import React, { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import Search from '../components/Search';

function Header({ orientation, device, openAuth }) {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(window.screen.width > 500);
    
    const openClientAuth = () => {
        openAuth('client'); // Especifica que o cadastro é de um cliente
        setLoginOpen(false);
    };

    const openLawyerAuth = () => {
        openAuth('lawyer'); // Especifica que o cadastro é de um advogado
        setLoginOpen(false);
    };

    const toggleLogin = () => {
        setLoginOpen(!isLoginOpen);
    };

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
                            <p onClick={openClientAuth} >Cliente</p>
                            <p onClick={openLawyerAuth} >Advogado</p>
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