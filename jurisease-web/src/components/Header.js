import './Header.css'
import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import UserInfo from './UserInfo';

function Header({ orientation, device, openAuth, user }) {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isUserInfoOpen, setUserInfoOpen] = useState(false);
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

    const toggleUserInfo = () => {
        setUserInfoOpen(!isUserInfoOpen);
    };

    useEffect(() => {
        function handleResize() {
            setShowSearch(!!(window.screen.width > 500));
        }

        handleResize();

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

                {!user && (
                    <div className="header-login">
                        <button onClick={toggleLogin} className="login-button">
                            Login
                        </button>
                        {isLoginOpen && (
                            <div className="login-options">
                                <p onClick={openClientAuth} >Cliente</p>
                                <p onClick={openLawyerAuth} >Advogado</p>
                            </div>
                        )}
                    </div>
                )}

                <div className='header-faleconosco'>
                    <p>Fale conosco</p>
                </div>

                {!!user && (
                    <div className='header-userInfo'>
                        <p onClick={toggleUserInfo} className='user-name'>{user.name.length > 10 ? `${user.name.substring(0, 15)}` : user.name} </p>
                        {isUserInfoOpen && (
                            <UserInfo orientation={orientation}/>
                        )}
                    </div>
                )}

            </div>
        </header>
    );
}

export default Header;