import './CardTemplate.css';
import React from 'react';

function CardTemplate({ data, onClick }) {
    const handleCardClick = () => {
        onClick(data);
    };

    const disableLinks = (html) => {
        // Substitui todas as tags <a> por <span>
        return html.replace(/<a\b[^>]*>/gi, '<span>').replace(/<\/a>/gi, '</span>');
    };

    if (!data) {
        return null;
    }

    return (
        <div className={`CardTemplate ${data.id}`} onClick={handleCardClick}>
            <h1>{data.title}</h1>
            <div className='template-doc' dangerouslySetInnerHTML={{ __html: disableLinks(data.content) }} />
            <p>{data.rout}</p>
        </div>
    );
}

export default CardTemplate;
