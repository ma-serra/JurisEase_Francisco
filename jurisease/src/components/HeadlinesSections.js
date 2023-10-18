import React from 'react';
import CardsAddModal from './CardsAddModal'
import Cards from './Cards'

function HeadlinesSection({ orientation, device }) {
    
    return (
        <div className={`headlines-content ${orientation} ${device}`}>
            <h1>Os temas mais atuais estão aqui</h1>
            
            <CardsAddModal type={'headline'}/>
            <Cards type={'headline'}/>

        </div>
    );
}

export default HeadlinesSection;