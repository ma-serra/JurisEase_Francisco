import './ManegeUsers.css'
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getUser } from '../../utils/data_base/firebase/dao/userDAO';

function ManegeUsers() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const isAuthenticated = isUserAuthenticated();

                if (isAuthenticated) {
                    const userData = await getUser(isAuthenticated);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUser();
    }, []);

    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(`/${link}`);
    };

    const breakAcess = () => {
        while (!user) {
            setTimeout(500)
        }

        if (!user.permissions.manege_users) {
            alert('Usuario não tem permissão de acesso a essa página!')
            navigateTo('')
        }
    }

    return (
        <div className={`ManegeUsers`}>
            {user && (
                breakAcess()
            )}
            
            <h1>ManegeUsers Page</h1>
        </div>
    );
}

export default ManegeUsers;