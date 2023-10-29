import React from 'react';

function Cards({ cards, onEditCard, permisionEdit }) {

    return (
        <div className={`cards-content`}>
          {cards.length > 1 ? (
            cards.map((card, index) => {
              // Verifica se o card possui um ID
              if (card.id) {
                return (
                  <div key={index} className="card">
                    {permisionEdit && (
                      <button className="bt-menu" onClick={() => onEditCard(card)}>
                      ⋮
                    </button>
                    )}
                    <a target="_blank" rel="noreferrer" href={'https://' + card.link}>
                      <img src={card.image} alt={`Imagem do Serviço ${index}`} />
                      <div>
                        <h2>{card.title}</h2>
                        <p>{card.description}</p>
                      </div>
                    </a>
                  </div>
                );
              }
              return null; // Renderiza nulo se o card não tiver um ID
            })
          ) : (
            <p>Nenhum card disponível.</p>
          )}
        </div>
      );
}

export default Cards;
