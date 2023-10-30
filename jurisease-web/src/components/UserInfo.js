import './UserInfo.css'
import React from 'react';

import { logout } from '../utils/data_base/firebase/authentication'

function UserInfo ({ orientation, openUserPage }) {
    return (
        <div className={`user-info ${orientation}`}>
            <p>Info</p>
            <p onClick={openUserPage}>Gerenciar Conta</p>
            <p onClick={() => {logout(); window.location.reload();}}>Sair</p>
        </div>
    );
}

export default UserInfo;