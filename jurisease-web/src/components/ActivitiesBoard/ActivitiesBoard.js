import './ActivitiesBoard.css'
import React from 'react';
import Search from '../Search/Search';
import ServicesSection from './Services/ServicesSection'
import HeadlinesSection from './Headlines/HeadlinesSection'

function ActivitiesBoard() {

    return (
        <section className={`ActivitiesBoard`}>
            <div className='search-activities'>
                <Search />
            </div>

            <ServicesSection permisionEdit={true} />
            <HeadlinesSection permisionEdit={true} />

        </section>
    );
}

export default ActivitiesBoard;