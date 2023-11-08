import './Test.css'
import React, { useEffect, useState } from 'react';
import { getService } from '../utils/data_base/firebase/dao/servicesDAO.js';
import Card from '../components/ActivitiesBoard/Cards/Card';

function Test() {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getService('service_1698098261452_uslcdnolwx');
        setServiceData(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao obter dados do serviço:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={`Test`}>
      <h1>Meu card</h1>

      <div className='meu-card'>
        {loading ? <p>Carregando...</p> : <Card data={serviceData} isEditable={true} setOnEditCard={() => {console.log('Edit')}} />}
      </div>
    </div>
  );
}

export default Test;
