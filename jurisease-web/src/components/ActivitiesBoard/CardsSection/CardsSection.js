import './CardsSection.css'
import React, { useEffect, useState } from 'react';
import Card from '../Cards/Card';

// Icons
import { MdLibraryAdd } from 'react-icons/md';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function CardsSection({ cardList }) {
    const [cardsVisibles, setCardsVisibles] = useState([]);
    const [position, setPosition] = useState(0);
    const [maxVisibleCards, setMaxVisibleCards] = useState(0);

    useEffect(() => {
        if (window.innerWidth < 500) {
            setMaxVisibleCards(2);

        } else if (window.innerWidth < 700) {
            setMaxVisibleCards(3);

        } else {
            setMaxVisibleCards(4);
        }

        setCardsVisibles(cardList.slice(position, position + maxVisibleCards));

    }, [position, cardList]);

    function handleScroll(direction) {
        const minPosition = 0;
        const maxPosition = Math.max(0, cardList.length - maxVisibleCards);

        setPosition((prevPosition) => {
            const newPosition = direction === 'left' ? prevPosition - 1 : prevPosition + 1;
            return Math.min(maxPosition, Math.max(minPosition, newPosition));
        });
    }

    if (!cardList || cardList.length === 0) {
        return null;
    }

    return (
        <div className="CardsSection">
            <div className='cards-section-title'>
                <h1>Cards </h1>
                <MdLibraryAdd className='bt-add-card' />
            </div>
            <div className="scroll-container">
                {cardsVisibles.length > 0 && cardsVisibles.map((card, index) => (
                    <Card data={card} isEditable={true} setOnEditCard={() => { console.log('Edit') }} />
                ))}
            </div>
            <button className="scroll-button left" onClick={() => handleScroll('left')}>
                <FaAngleLeft className='icon-arrow' />
            </button>
            <button className="scroll-button right" onClick={() => handleScroll('right')}>
                <FaAngleRight className='icon-arrow' />
            </button>
        </div>
    );
}

export default CardsSection;
