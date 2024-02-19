import './Card.css'
import React from 'react';

import { FaPencilAlt } from 'react-icons/fa';

function Card({ data, isEditable, setOnEditCard }) {
    const handleCardClick = () => {
        window.open('https://' + data.link, '_blank');
    };

    const handleEditClick = (e) => {
        e.stopPropagation(); // Impede a propagação do evento de clique para o card
        setOnEditCard(data); // Executa a função de edição
    };

    if (!data || !data.id) {
        return null;
    }

    return (
        <div className={`Card ${data.id}`} onClick={handleCardClick}>
            {isEditable && (
                <button className="bt-edit" onClick={handleEditClick}>
                    <FaPencilAlt className="icon-pencil" /> {/* Ícone do lápis */}
                </button>
            )}

            <img className="card-image" src={data.image} alt={`Imagem do Serviço ${data.id}`} />
            <div className="card-content">
                <h1>{data.title}</h1>
                <h2>{data.description}</h2>
            </div>
        </div>
    );
}

export default Card;
