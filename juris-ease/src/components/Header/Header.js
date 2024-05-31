import './Header.css'
import React, { useState } from 'react';

import { logout } from '../../utils/data_base/firebase/authentication'
import { IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import AuthPage from '../Popups/AuthPage/AuthPage'
import UserManagement from '../Popups/UserManagement/UserManagement'

function Header({ user, fetchUser }) {
    const [openLoginOptions, setOpenLoginOptions] = useState(false);  // Menu com as opções de login
    const [openLoginAuth, setOpenLoginAuth] = useState(false)  // Abrir popupLogin
    const [loginType, setLoginType] = useState()  // tipo de login

    const [openMenu, setOpenMenu] = useState(false);
    const [openUserManagement, setOpenUserManagement] = useState(false);
    
    const toggleOpenLoginOptions = () => {
        setOpenLoginOptions(!openLoginOptions);
    };

    const toggleOpenMenu = () => {
        setOpenMenu(!openMenu);
    };

    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(`/${link}`);
    };

    return (
        <header className={`Header`}>

            <div className="left-container" onClick={() => { navigateTo('') }}>
                <div >
                    <img className="logo" src="images/logo.png" alt="Logo do Meu Site" />
                </div>
                <div >
                    <h1 className="title">Juris Ease</h1>
                </div>
            </div>

            {!user && (
                <div className="right-container">
                    <button className="bt-login" onClick={toggleOpenLoginOptions}>
                        Login <IoIosArrowDown />
                    </button>

                    {openLoginOptions && (
                        <div className="drop-down">
                            <p onClick={() => {setOpenLoginAuth(true); setLoginType('client')}} >Cliente</p>
                            <p onClick={() => {setOpenLoginAuth(true); setLoginType('lawyer')}} >Advogado</p>
                        </div>
                    )}
                </div>
            )}

            {openLoginAuth && (
                <AuthPage onClose={() => setOpenLoginAuth(false)} auth={loginType} fetchUser={fetchUser}/>
            )}

            {user && (
                <div className="right-container">
                    <p className='user-name' onClick={toggleOpenMenu}>{user.name.length > 10 ? `${user.name.substring(0, 15)}` : user.name} </p>
                    {openMenu && (
                        <div className="drop-down">
                            <p onClick={() => { toggleOpenMenu(); setOpenUserManagement(true) }}>Gerenciar Conta</p>
                            {user.permissions.document_generation && (
                                <p onClick={() => { navigateTo('generate-docks') }}>Fazer uma nova petição inicial</p>
                            )}
                            {user.permissions.templates && (
                                <p onClick={() => { navigateTo('templates') }}>Templates</p>
                            )}
                            {user.permissions.manege_users && (
                                <p onClick={() => { navigateTo('manege-users') }}>Gerenciar Usuários</p>
                            )}
                            <p onClick={() => { logout(); window.location.reload() }}>Sair</p>
                        </div>
                    )}
                </div>
            )}

            {openUserManagement && (
                <UserManagement onClose={() => setOpenUserManagement(false)} user={user} fetchUser={fetchUser}/>
            )}
        </header>
    );
}

export default Header;