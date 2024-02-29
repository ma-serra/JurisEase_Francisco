import './CardsSection.css'
import React, { useEffect, useState } from 'react';

import Card from './Card';

// Icons
import { MdLibraryAdd } from 'react-icons/md';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function CardsSection({ type, cardList, isEditable, setOnEditCard }) {
    const [cardsVisibles, setCardsVisibles] = useState([]);
    const [position, setPosition] = useState(0);
    const [maxVisibleCards, setMaxVisibleCards] = useState(0);

    const [totalSections, setTotalSections] = useState(1);
    const [currentSection, setCurrentSection] = useState(1);

    const handleNewCard = () => {
        setOnEditCard({});
    };

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 500) {
                setMaxVisibleCards(2);

            } else if (window.innerWidth < 700) {
                setMaxVisibleCards(3);

            } else {
                setMaxVisibleCards(4);
            }

            if (cardList && maxVisibleCards !== 0) {
                const sections = Math.ceil(cardList.length / maxVisibleCards);
                setTotalSections(sections);
            } else {
                setTotalSections(1);
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [cardList, maxVisibleCards]);

    useEffect(() => {
        if (!!cardList) {
            if (cardList.length <= maxVisibleCards) {
                setCardsVisibles(cardList);
            } else {
                setCardsVisibles(cardList.slice(position, position + maxVisibleCards));
            }
        }
    }, [position, maxVisibleCards, cardList]);

    function handleScroll(direction) {
        const minPosition = 0;
        const maxPosition = Math.max(0, (!!cardList ? cardList.length : 0) - maxVisibleCards);

        setPosition((prevPosition) => {
            const newPosition = direction === 'left' ? prevPosition - 1 : prevPosition + 1;
            return Math.min(maxPosition, Math.max(minPosition, newPosition));
        });

        // Atualiza a seção atual com base na nova posição
        const newSection = Math.ceil((position + 1) / maxVisibleCards);
        setCurrentSection(newSection);
    }

    function handleIndicatorClick(section) {
        // Calcula a nova posição com base na seção clicada
        const newPosition = (section - 1) * maxVisibleCards;
        setPosition(newPosition);
        setCurrentSection(section);
    }

    if (!cardList || cardList.length === 0) {
        return (
            <div className="CardsSection">
                <div className='cards-section-title'>
                    <h1>{type}</h1>
                    {isEditable && (
                        <MdLibraryAdd className='bt-add-card' onClick={handleNewCard} />
                    )}

                </div>
                <h1>Nenhum Card adicionado!</h1>
            </div>

        );
    }

    return (
        <div className="CardsSection">
            <div className='cards-section-title'>
                <h1>{type}</h1>
                {isEditable && (
                    <MdLibraryAdd className='bt-add-card' onClick={handleNewCard} />
                )}
            </div>

            <div className="scroll-container">
                {cardsVisibles && cardsVisibles.length > 0 && cardsVisibles.map((card) => (
                    <Card key={card.id} data={card} isEditable={isEditable} setOnEditCard={setOnEditCard} />
                ))}
            </div>

            <button className="scroll-button left" onClick={() => handleScroll('left')}>
                <FaAngleLeft className='icon-arrow' />
            </button>

            <button className="scroll-button right" onClick={() => handleScroll('right')}>
                <FaAngleRight className='icon-arrow' />
            </button>

            <div className="section-indicators">
                {Array.from({ length: totalSections || 0 }).map((_, index) => (
                    <div
                        key={index}
                        className={`section-indicator ${currentSection === index + 1 ? 'active' : ''}`}
                        onClick={() => handleIndicatorClick(index + 1)}
                    />
                ))}
            </div>

        </div>
    );
}

export default CardsSection;
