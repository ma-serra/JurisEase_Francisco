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

    useEffect(() => {
        async function fetchData() {
            try {
                const auth = await isUserAuthenticated();

                if (auth) {
                    const userData = await getUser(auth);

                    if (userData) {
                        setUser(userData);

                    } else {
                        console.error("Erro ao obter dados do usuário. Usuário é null.");
                    }
                } else {
                    console.log("Erro de autenticação: Auth auth não encontrado.");
                }
            } catch (error) {
                console.log("Erro ao buscar dados:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <section className={`ActivitiesBoard`}>
            <div className='search-activities'>
                <Search setSearch={setSearch}/>
            </div>

            <ServicesSection permisionEdit={user && user.permissions.services} filter={search}/>
            <HeadlinesSection permisionEdit={user && user.permissions.headlines} filter={search}/>
        </section>
    );
}

export default ActivitiesBoard;
