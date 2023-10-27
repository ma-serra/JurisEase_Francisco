import React, { useEffect, useState } from 'react';
import CardsAddModal from './CardsAddModal';
import Cards from './Cards';
import { getServices, addService, removeService, updateService } from '../utils/data_base/firebaseUtil';

function ServiceSection({ orientation, device }) {
    const [services, setServices] = useState([]);
    const [editingService, setEditingService] = useState(null);

    const handleEditService = (card) => {
        setEditingService(card);
    };

    const handleCancelEdit = () => {
        setEditingService(null);
    };

    useEffect(() => {
        // Função para buscar e ouvir mudanças nos serviços
        const fetchServicesAndListen = () => {
            getServices((servicesData) => {
                setServices(servicesData);
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
        <div className={`services-content ${orientation} ${device}`}>
            <h1>Áreas de Serviços</h1>
            <CardsAddModal
                onAddCard={handleAddService}
                onRemoveCard={handleRemoveService}
                onUpdateCard={handleUpdateService}
                cardInEdition={editingService}
                onCancelEdit={handleCancelEdit}
            />
            <Cards cards={services} onEditCard={handleEditService} />
        </div>
    );
}

export default ServiceSection;
