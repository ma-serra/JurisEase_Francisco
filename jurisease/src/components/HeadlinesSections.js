import React, { useEffect, useState } from 'react';
import CardsAddModal from './CardsAddModal';
import Cards from './Cards';
import { getHeadlines, addHeadline, removeHeadline, updateHeadline } from '../bd/firebase/firebase';

function HeadlineSection({ orientation, device }) {
    const [headlines, setHeadlines] = useState([]);
    const [editingHeadline, setEditingHeadline] = useState(null);

    const handleEditHeadline = (card) => {
        setEditingHeadline(card);
    };

    const handleCancelEdit = () => {
        setEditingHeadline(null);
    };

    useEffect(() => {
        // Função para buscar e ouvir mudanças nas manchetes
        const fetchHeadlinesAndListen = () => {
            getHeadlines((headlinesData) => {
                setHeadlines(headlinesData);
            });
        };

        fetchHeadlinesAndListen();
    }, []);

    const handleAddHeadline = (newHeadline) => {
        addHeadline(newHeadline);
    };

    const handleRemoveHeadline = (headlineId) => {
        removeHeadline(headlineId);
    };

    const handleUpdateHeadline = (headlineId) => {
        updateHeadline(headlineId);
    };

    return (
        <div className={`headlines-content ${orientation} ${device}`}>
            <h1>Áreas de Serviços</h1>
            <CardsAddModal
                onAddCard={handleAddHeadline}
                onRemoveCard={handleRemoveHeadline}
                onUpdateCard={handleUpdateHeadline}
                cardInEdition={editingHeadline}
                onCancelEdit={handleCancelEdit}
            />
            <Cards cards={headlines} onEditCard={handleEditHeadline} />
        </div>
    );
}

export default HeadlineSection;
