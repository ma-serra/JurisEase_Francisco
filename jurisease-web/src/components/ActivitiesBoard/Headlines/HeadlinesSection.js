import React, { useEffect, useState } from 'react';
import CardsAddModal from '../Cards/CardsAddModal';
import Cards from '../Cards/Cards';
import { getHeadlines, addHeadline, removeHeadline, updateHeadline } from '../../../utils/data_base/firebase/dao/headlinesDAO';

function HeadlineSection({ orientation, device, permisionEdit }) {
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
            <h1>Áreas de Manchetes</h1>
            {permisionEdit && (
                <CardsAddModal
                onAddCard={handleAddHeadline}
                onRemoveCard={handleRemoveHeadline}
                onUpdateCard={handleUpdateHeadline}
                cardInEdition={editingHeadline}
                onCancelEdit={handleCancelEdit}
                />
                )}
            <Cards cards={headlines} onEditCard={handleEditHeadline} permisionEdit={permisionEdit} />
        </div>
    );
}

export default HeadlineSection;
