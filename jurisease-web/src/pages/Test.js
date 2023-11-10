import './Test.css'
import React, { useEffect, useState } from 'react';
import CardsSection from '../components/ActivitiesBoard/CardsSection/CardsSection.js';
import { getServices, addService, removeService, updateService } from '../utils/data_base/firebase/dao/servicesDAO.js';
import { removeObjetosVazios } from '../utils/tools.js'
function Test() {
  const [loading, setLoading] = useState(true);
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
        const cards = [servicesData[0]]
        setServices(removeObjetosVazios(cards));
        setLoading(false);
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
    <div className={`Test`}>
      <div className='test-container'>
        {loading ? <p>Carregando...</p> : <CardsSection cardList={services} />}
      </div>
    </div>
  );
}

export default Test;
