import './HeadlinesSection.css'
import React, { useEffect, useState } from 'react';
import CardsAddModal from '../Cards/CardsAddModal';
import CardsSection from '../CardsSection/CardsSection';
import { getHeadlines, addHeadline, removeHeadline, updateHeadline } from '../../../utils/data_base/firebase/dao/headlinesDAO';
import { removeObjetosVazios } from '../../../utils/tools'

function HeadlineSection({ permisionEdit }) {
    const [headlines, setHeadlines] = useState([]);
    const [editingHeadline, setEditingHeadline] = useState(null);

    const handleEditHeadline = (card) => {
        setEditingHeadline(card);
    };

    const handleCancelEdit = () => {
        setEditingHeadline(null);
    };

    useEffect(() => {
        const fetchHeadlinesAndListen = () => {
            getHeadlines((headlinesData) => {
                const cards = removeObjetosVazios([...headlinesData, ...headlinesData, ...headlinesData, ...headlinesData])
                setHeadlines(cards);
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
        <div className={`HeadlinesSection`}>
            {!permisionEdit && (
                <CardsAddModal
                    onAddCard={handleAddHeadline}
                    onRemoveCard={handleRemoveHeadline}
                    onUpdateCard={handleUpdateHeadline}
                    cardInEdition={editingHeadline}
                    onCancelEdit={handleCancelEdit}
                />
            )}
            <CardsSection type={'Headlines'} cardList={headlines} isEditable={permisionEdit} setOnEditCard={handleAddHeadline} />
        </div>
    );
}

export default HeadlineSection;
