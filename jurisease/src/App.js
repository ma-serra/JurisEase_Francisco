import './App.css';
import React, { useState, useEffect } from 'react';
import './styles.css';
import Header from './components/Header';
import LawyerSection from './components/LawyerSection';
import Footer from './components/Footer';
import ServiceSection from './components/ServicesSection';
import MancheteSection from './components/ManchetesSections';

function App() {

  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {

    function handleResize() {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      setOrientation(!!isPortrait ? 'portrait' : 'landscape')
    }

    // Adiciona o ouvinte de evento resize
    window.addEventListener('resize', handleResize);

    return () => {
      // Remova o ouvinte de evento ao desmontar o componente
      window.removeEventListener('resize', handleResize);
    };

  }, []);

  return (
    <div className="App">
      <Header orientation={orientation}/>
      <LawyerSection orientation={orientation}/>
      <ServiceSection orientation={orientation}/>
      <MancheteSection orientation={orientation}/>
      <Footer orientation={orientation}/>
    </div>
  );
}

export default App;
