import './App.css';
import React from 'react';
import './styles.css';
import Header from './components/Header';
import LawyerSection from './components/LawyerSection';
import Footer from './components/Footer';
import ServiceSection from './components/ServicesSection';
import MancheteSection from './components/ManchetesSections';

function App() {
  return (
    <div className="App">
      <Header />
      <LawyerSection />
      <ServiceSection />
      <MancheteSection />
      <Footer />
    </div>
  );
}

export default App;
