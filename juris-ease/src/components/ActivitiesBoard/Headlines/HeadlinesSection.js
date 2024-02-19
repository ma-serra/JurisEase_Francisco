import './HeadlinesSection.css'
import React, { useEffect, useState } from 'react';
import CardEditSection from '../Cards/CardEditSection';
import CardsSection from '../CardsSection/CardsSection';
import { getHeadlines, addHeadline, removeHeadline, updateHeadline } from '../../../utils/data_base/firebase/dao/headlinesDAO';
import { isEmptyObject, removeObjetosVazios } from '../../../utils/tools/tools'

function HeadlineSection({ permisionEdit }) {
    const [headlines, setHeadlines] = useState([]);
    const [editingHeadline, setEditingHeadline] = useState(null);

    const handleEditHeadline = (card) => {
        setEditingHeadline(card);
    };

    useEffect(() => {
        const fetchHeadlinesAndListen = () => {
            getHeadlines((headlinesData) => {
                const cards = removeObjetosVazios(headlinesData)
                setHeadlines(cards);
            });
        };

        fetchHeadlinesAndListen();
    }, []);

    return (
        <div className={`HeadlinesSection`}>
            {editingHeadline && (
                <CardEditSection cardInEdition={editingHeadline} onCancelEdit={handleEditHeadline} onAddCard={addHeadline} onRemoveCard={removeHeadline} onUpdateCard={updateHeadline}/>
            )}

            {!editingHeadline && (
                <CardsSection type={'Manchetes'} cardList={headlines} isEditable={permisionEdit} setOnEditCard={handleEditHeadline} />
            )}
        </div>
    );
}

export default HeadlineSection;
