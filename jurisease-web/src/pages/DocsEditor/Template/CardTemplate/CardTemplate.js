import './CardTemplate.css'
import React from 'react';

function CardTemplate({ data, onClick }) {
    const handleCardClick = () => {
        onClick(data)
    };

    if (!data) {
        return null;
    }

    return (
        <div className={`CardTemplate ${data.id}`} onClick={handleCardClick}>

            <h1>{data.title}</h1>
            <div className='template-doc'>
                {data.doc}
            </div>
            <p>{data.rout}</p>

        </div>
    );
}

export default CardTemplate;
