import './Header.css'
import React, { useState } from 'react';

import { logout } from '../../utils/data_base/firebase/authentication'
import { IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

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
        if (!!openAuth){
            setUserInfoOpen(!isUserInfoOpen);
        }
    };

    const navigate = useNavigate();

    const navigateTo = ( link ) => {
        navigate(`/${link}`);
    };

    return (
        <header className={`Header`}>

            <div className="left-container" onClick={() => { navigateTo('')}}>
                <div >
                    <img className="logo" src="images/logo.png" alt="Logo do Meu Site" />
                </div>
                <div >
                    <h1 className="title">Juris Ease</h1>
                </div>
            </div>

            <div className="right-container">
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

                {!!user && (
                    <div>
                        <p className='user-name' onClick={toggleUserInfo}>{user.name.length > 10 ? `${user.name.substring(0, 15)}` : user.name} </p>
                        {isUserInfoOpen && (
                            <div className="drop-down">
                                <p onClick={() => { toggleUserInfo(); openUserManagement() }}>Gerenciar Conta</p>
                                {user.permissions.document_generation && (
                                    <p onClick={() => { navigateTo('generate-docks') }}>Gerador de Documentos</p>
                                )}
                                {user.permissions.templates && (
                                    <p onClick={() => { navigateTo('templates') }}>Templates</p>
                                )}
                                {user.permissions.manege_users && (
                                    <p onClick={() => { navigateTo('manege-users') }}>Gerenciar Usuários</p>
                                )}
                                <p onClick={() => { logout(); window.location.reload(); }}>Sair</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </header>
    );
}

export default Header;