import './ServiceSection.css'
import React, { useEffect, useState } from 'react';
import CardsAddModal from '../Cards/CardsAddModal';
import CardsSection from '../CardsSection/CardsSection';
import { getServices, addService, removeService, updateService } from '../../../utils/data_base/firebase/dao/servicesDAO';
import { removeObjetosVazios } from '../../../utils/tools'

function ServiceSection ({ permisionEdit }) {
    const [services, setServices] = useState([]);
    const [editingService, setEditingService] = useState(null);

    const handleEditService = (card) => {
        setEditingService(card);
    };

    const handleCancelEdit = () => {
        setEditingService(null);
    };

    useEffect(() => {
        const fetchServicesAndListen = () => {
            getServices((servicesData) => {
                const cards = removeObjetosVazios([...servicesData, ...servicesData, ...servicesData, ...servicesData])
                setServices(cards);
            });
        };

        fetchServicesAndListen();
    }, []);

    const handleAddService = (newService) => {
        addService(newService);
    };

    const handleRemoveService = (serviceId) => {
        removeService(serviceId);
    };

    const handleUpdateService = (serviceId) => {
        updateService(serviceId);
    };

    return (
        <div className={`ServicesSection`}>
            <CardsSection type={'Services'} cardList={services} isEditable={permisionEdit} setOnEditCard={handleEditService}/>
        </div>
    );
}

export default ServiceSection;
