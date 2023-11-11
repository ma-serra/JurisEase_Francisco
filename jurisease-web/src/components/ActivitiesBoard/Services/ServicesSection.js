import './ServiceSection.css'
import React, { useEffect, useState } from 'react';
import CardEditSection from '../Cards/CardEditSection';
import CardsSection from '../CardsSection/CardsSection';
import { getServices, addService, removeService, updateService } from '../../../utils/data_base/firebase/dao/servicesDAO';
import { removeObjetosVazios } from '../../../utils/tools'

function ServiceSection ({ permisionEdit }) {
    const [services, setServices] = useState([]);
    const [editingService, setEditingService] = useState(null);

    const handleEditService = (card) => {
        setEditingService(card);
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

    return (
        <div className={`ServicesSection`}>
            {editingService && (
                <CardEditSection cardInEdition={editingService} onCancelEdit={handleEditService} onAddCard={addService} onRemoveCard={removeService} onUpdateCard={updateService}/>
            )}

            {!editingService && (
                <CardsSection type={'Serviços'} cardList={services} isEditable={permisionEdit} setOnEditCard={handleEditService} />
            )}
        </div>
    );
}

export default ServiceSection;
