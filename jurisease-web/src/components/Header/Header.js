import './Header.css'
import React, { useState } from 'react';
import Search from '../Search/Search';


import { logout } from '../../utils/data_base/firebase/authentication'

import { IoIosArrowDown } from 'react-icons/io';

function Header({ openAuth, user, openUserManagement }) {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isUserInfoOpen, setUserInfoOpen] = useState(false);

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

    return (
        <header className={`Header`}>

            <div className="left-container">
                <div >
                    <img className="logo" src="images/logo.png" alt="Logo do Meu Site" />
                </div>
                <div >
                    <h1 className="title">Juris Ease</h1>
                </div>
            </div>

            <div className="right-container">
                <div className="search">
                    <Search />
                </div>

                {!user && (
                    <div>
                        <button className="bt-login" onClick={toggleLogin}>
                            Login <IoIosArrowDown />
                        </button>

                        {isLoginOpen && (
                            <div className="drop-down">
                                <p onClick={openClientAuth} >Cliente</p>
                                <p onClick={openLawyerAuth} >Advogado</p>
                            </div>
                        )}
                    </div>
                )}

                <div className='contato'>
                    <p>Fale conosco</p>
                </div>

                {!!user && (
                    <div>
                        <p className='user-name' onClick={toggleUserInfo}>{user.name.length > 10 ? `${user.name.substring(0, 15)}` : user.name} </p>
                        {isUserInfoOpen && (
                            <div className="drop-down">
                            <p onClick={toggleUserInfo}>Info</p>
                            <p onClick={() => {toggleUserInfo(); openUserManagement()}}>Gerenciar Conta</p>
                            <p onClick={() => {logout(); window.location.reload();}}>Sair</p>
                        </div>
                        )}
                    </div>
                )}

            </div>
        </header>
    );
}

export default Header;