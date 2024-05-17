import './CardEditSection.css'
import React, { useEffect, useState } from 'react';

import { isEmptyObject } from '../../../utils/tools/tools'
import AlertDialog from '../../Popups/AlertDialog/AlertDialog';

function CardEditSection({ onAddCard, onRemoveCard, onUpdateCard, cardInEdition, onCancelEdit }) {
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [cardData, setCardData] = useState({
        image: './images/clique-aqui.png',
        title: '',
        description: '',
        link: '',
    });

    useEffect(() => {
        if (cardInEdition) {
            setCardData({
                id: cardInEdition.id,
                image: cardInEdition.image || './images/clique-aqui.png',
                title: cardInEdition.title,
                description: cardInEdition.description,
                link: cardInEdition.link,
                createdAt: cardInEdition.createdAt,
            });

            setIsOpen(true);
        }
    }, [cardInEdition]);

    const openModal = () => {
        setIsOpen(true);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCardData({ ...cardData, image: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApply = (event) => {
        event.preventDefault();
        applyCardOperation();
    };

    const applyCardOperation = () => {
        if (cardData.image && cardData.title && cardData.description && cardData.link) {
            if (!isEmptyObject(cardInEdition)) {
                // Se há um card em edição, atualize-o
                console.log('uppdate')
                onUpdateCard(cardData);
            } else {
                // Caso contrário, adicione um novo card
                console.log('add')
                onAddCard(cardData);
            }

            resetCardData();
            setIsOpen(false);

        } else {
            setError('Preencha todos os campos.');
        }
    };

    const handleDeleteCard = () => {
        AlertDialog.show(
            'Tem certeza de que deseja deletar este card?',
            deleteCard,
            () => console.log('canceled')
        );
    };

    const deleteCard = () => {
        onRemoveCard(cardInEdition.id);
        resetCardData();
        setIsOpen(false);
    };

    const cancelCard = () => {
        resetCardData();
        setIsOpen(false);
    };

    const resetCardData = () => {
        onCancelEdit()
        setCardData({
            image: 'clique-aqui.png',
            title: '',
            description: '',
            link: '',
        });
    };

    return (
        <div className='CardEditSection'>
            {isEmptyObject(cardInEdition) && (
                <h1 onClick={openModal}>
                    Adicionar Novo Card
                </h1>
            )}

            {!isEmptyObject(cardInEdition) && (
                <h1 onClick={openModal}>
                    Atualizar Card
                </h1>
            )}

            {isOpen && (
                <div className="CardEdit">
                    <button className="bt-close" onClick={cancelCard}> X </button>

                    <img className='card-edit-image'
                        src={cardData.image}
                        alt="Imagem do Card"
                        onClick={() => document.getElementById('fileInput').click()}
                    />

                    <form className="card-edit-content" onSubmit={handleApply}>
                        <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <input
                            type="text"
                            placeholder="Título"
                            value={cardData.title}
                            onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Descrição"
                            value={cardData.description}
                            onChange={(e) => setCardData({ ...cardData, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Link"
                            value={cardData.link}
                            onChange={(e) => setCardData({ ...cardData, link: e.target.value })}
                        />
                    </form>
                    {error && <p className="msg-error">{error}</p>}
                    <div className='bts-actions'>
                        {!isEmptyObject(cardInEdition) && (
                            <button className='bt-delete' onClick={handleDeleteCard}>
                                Deletar
                            </button>
                        )}
                        <button className="bt-add" onClick={handleApply}>
                            {!isEmptyObject(cardInEdition) ? 'Atualizar' : 'Adicionar'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardEditSection;
