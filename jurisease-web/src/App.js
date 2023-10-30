import './App.css';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home'

function App() {

  const [orientation, setOrientation] = useState('portrait');
  const [device, setDevice] = useState(window.innerWidth > 768 ? 'desktop' : 'mobile')
  const [currentPage, setCurrentPage] = useState('Home')

  useEffect(() => {

    function handleResize() {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      setOrientation(!!isPortrait ? 'portrait' : 'landscape')
      const width = window.innerWidth
      const device =
        width > 765 ? 'desktop' :
          width > 320 ? 'mobile' :
            'mini';

      setDevice(device);
    }

    handleResize()

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);

  return (
    <div className="App">
      {currentPage === 'Home' && (
        <Home orientation={orientation} device={device} setCurrentPage={setCurrentPage}/>
      )}
    </div>
  );
}

export default App;
