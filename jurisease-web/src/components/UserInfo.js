import './UserInfo.css'
import React from 'react';

import { logout } from '../utils/data_base/firebase/authentication'

function UserInfo ({ orientation, openUserPage, close }) {
    return (
        <div className={`user-info ${orientation}`}>
            <p onClick={close}>Info</p>
            <p onClick={() => {close(); openUserPage()}}>Gerenciar Conta</p>
            <p onClick={() => {logout(); window.location.reload();}}>Sair</p>
        </div>
    );
}

export default UserInfo;