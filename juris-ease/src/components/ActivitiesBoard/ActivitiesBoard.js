import './ActivitiesBoard.css';
import React, { useEffect, useState } from 'react';
import Search from '../Search/Search';
import ServicesSection from './Services/ServicesSection';
import HeadlinesSection from './Headlines/HeadlinesSection';

import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getUser } from '../../utils/data_base/firebase/dao/userDAO';

function ActivitiesBoard() {
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const [permissionEdit, setPermission] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const auth = await isUserAuthenticated();

                if (auth) {
                    const userData = await getUser(auth);

                    if (userData) {
                        setUser(userData);

                        setPermission(userData.acessAdmin);
                    } else {
                        console.error("Erro ao obter dados do usuário. Usuário é null.");
                    }
                } else {
                    console.error("Erro de autenticação. Auth é null.");
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <section className={`ActivitiesBoard`}>
            <div className='search-activities'>
                <Search setSearch={setSearch}/>
            </div>

            <ServicesSection permisionEdit={permissionEdit} filter={search}/>
            <HeadlinesSection permisionEdit={permissionEdit} filter={search}/>
        </section>
    );
}

export default ActivitiesBoard;
