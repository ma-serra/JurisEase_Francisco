import React, { useEffect, useState } from 'react';
import { getServices, getHeadlines } from '../bd/firebase/firebase'

function Cards({ type }) {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                let cardsData;
                if (type === 'service') {
                    cardsData = await getServices()
                } else
                    if (type === 'headline') {
                        cardsData = await getHeadlines()
                    }

                if (cardsData) {
                    const cardsArray = Object.values(cardsData);
                    console.log(cardsArray);
                    setCards(cardsArray);
                }
            } catch (error) {
                console.error('Erro ao buscar serviços:', error);
            }
        };

        fetchCards();
    }, []);

    return (
        <div className={`cards-content`}>
            {cards.map((card, index) => (
                <div key={index} className="card">
                    <a target="_blank" rel="noreferrer" href={'https://' + card.link}>
                        <img src={card.image} alt={`Imagem do Serviço ${index}`} />
                        <div>
                            <h2>{card.title}</h2>
                            <p>{card.description}</p>
                        </div>
                    </a>
                </div>
            ))}
        </div>
    );
}

export default Cards;
