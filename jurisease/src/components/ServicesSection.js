import React from 'react';
import CardsAddModal from './CardsAddModal'
import Cards from './Cards'

function ServiceSection({ orientation, device }) {

    return (
        <div className={`services-content ${orientation} ${device}`}>
            <h1>Áreas de Serviços</h1>

            <CardsAddModal type={'service'}/>
            <Cards type={'service'}/>

        </div>
    );
}

export default ServiceSection;