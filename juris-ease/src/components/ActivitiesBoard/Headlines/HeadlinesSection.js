import './HeadlinesSection.css'
import React, { useEffect, useState } from 'react';

import CardEditSection from '../../Cards/Card/CardEditSection';
import CardsSection from '../../Cards/Card/CardsSection';

import { getHeadlines, addHeadline, removeHeadline, updateHeadline } from '../../../utils/data_base/firebase/dao/headlinesDAO';
import { removeObjetosVazios, normalizeText } from '../../../utils/tools/tools'

function HeadlineSection({ permisionEdit, filter }) {
    const [headlines, setHeadlines] = useState([]);
    const [editingHeadline, setEditingHeadline] = useState(null);
    const [filtredHeadlines, setFiltredHeadlines] = useState(null)

    const handleEditHeadline = (card) => {
        setEditingHeadline(card);
    };

    const filterCards = (filterText) => {
        if (!filterText) {
            return null
        }

        const searchText = normalizeText(filterText)

        const filtered = headlines.filter(card => {
            const description = normalizeText(card.description)
            const title = normalizeText(card.title)
            return title.includes(searchText) || description.includes(searchText);
        });
        setFiltredHeadlines(filtered);
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

    useEffect(() => {
        filterCards(filter.trim());
    }, [filter]);

    return (
        <div className={`HeadlinesSection`}>
            {editingHeadline && (
                <CardEditSection cardInEdition={editingHeadline} onCancelEdit={handleEditHeadline} onAddCard={addHeadline} onRemoveCard={removeHeadline} onUpdateCard={updateHeadline}/>
            )}

            {!editingHeadline && (
                <CardsSection type={'Manchetes'} cardList={ filtredHeadlines !== null ? filtredHeadlines : headlines } isEditable={permisionEdit} setOnEditCard={handleEditHeadline} />
            )}
        </div>
    );
}

export default HeadlineSection;
