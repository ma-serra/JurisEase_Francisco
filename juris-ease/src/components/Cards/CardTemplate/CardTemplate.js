import './CardTemplate.css';
import React from 'react';

function CardTemplate({ card, onClick }) {

    const handleCardClick = () => {
        onClick(card);
    };

    const disableLinks = (html) => {
        if (!html) {
            return html
        }
        // Substitui todas as tags <a> por <span>
        return html.replace(/<a\b[^>]*>/gi, '<span>').replace(/<\/a>/gi, '</span>');
    };

    if (!card) {
        return null;
    }

    return (
        <div className={`CardTemplate ${card.id}`} onClick={handleCardClick}>
            <h1>{card.title}</h1>
            <div className='template-doc' dangerouslySetInnerHTML={{ __html: disableLinks(card.contents[0]) }} />
            <p>{card.rout}</p>
        </div>
    );
}

export default CardTemplate;
