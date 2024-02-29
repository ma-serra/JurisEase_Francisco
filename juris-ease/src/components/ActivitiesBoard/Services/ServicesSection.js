import './ServiceSection.css'
import React, { useEffect, useState } from 'react';

import CardEditSection from '../../Cards/Card/CardEditSection';
import CardsSection from '../../Cards/Card/CardsSection';

import { getServices, addService, removeService, updateService } from '../../../utils/data_base/firebase/dao/servicesDAO';
import { removeObjetosVazios, normalizeText } from '../../../utils/tools/tools'

function ServiceSection({ permisionEdit, filter }) {
    const [services, setServices] = useState([]);
    const [filtredServices, setFiltredServices] = useState(null)
    const [editingService, setEditingService] = useState(null);

    const handleEditService = (card) => {
        setEditingService(card);
    };

    const filterCards = (filterText) => {
        if (!filterText) {
            return null
        }

        const searchText = normalizeText(filterText)

        const filtered = services.filter(card => {
            const description = normalizeText(card.description)
            const title = normalizeText(card.title)
            return title.includes(searchText) || description.includes(searchText);
        });
        setFiltredServices(filtered);
    };

    useEffect(() => {
        const fetchServicesAndListen = () => {
            getServices((servicesData) => {
                const cards = removeObjetosVazios(servicesData)
                setServices(cards);
            });
        };

        fetchServicesAndListen();
    }, []);

    useEffect(() => {
        filterCards(filter.trim());
    }, [filter]);

    return (
        <div className={`ServicesSection`}>
            {editingService && (
                <CardEditSection cardInEdition={editingService} onCancelEdit={handleEditService} onAddCard={addService} onRemoveCard={removeService} onUpdateCard={updateService} />
            )}

            {!editingService && (
                <CardsSection type={'Serviços'} cardList={filtredServices !== null ? filtredServices : services} isEditable={permisionEdit} setOnEditCard={handleEditService} />
            )}
        </div>
    );
}

export default ServiceSection;
