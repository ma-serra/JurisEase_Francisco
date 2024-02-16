import './CardTemplate.css';
import React, { useState } from 'react';

function CardTemplate({ data, onClick }) {
    const [showFullContent, setShowFullContent] = useState(false);
    const MAX_CONTENT_LENGTH = 3000;

    const toggleShowContent = () => {
        setShowFullContent(!showFullContent);
    };

    const truncatedContent = data.content.length > MAX_CONTENT_LENGTH ?
        data.content.substring(0, MAX_CONTENT_LENGTH) + "..." : data.content;

    const handleCardClick = () => {
        onClick(data);
    };

    if (!data) {
        return null;
    }

    return (
        <div className={`CardTemplate ${data.id}`} onClick={handleCardClick}>
            <h1>{data.title}</h1>
            <div className='template-doc' dangerouslySetInnerHTML={{ __html: showFullContent ? data.content : truncatedContent }} />
            <p>{data.rout}</p>
        </div>
    );
}

export default CardTemplate;
