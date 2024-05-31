import './ActivitiesBoard.css';
import React, { useState } from 'react';

import Search from '../Search/Search';
import ServicesSection from './Services/ServicesSection';
import HeadlinesSection from './Headlines/HeadlinesSection';


function ActivitiesBoard({ user }) {
    const [search, setSearch] = useState('');

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
