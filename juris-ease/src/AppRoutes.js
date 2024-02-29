import React from 'react';

import Home from './pages/Home/Home';
import GenerateDocks from './pages/GenerateDocks/GenerateDocks';
import Template from './pages/Template/Template';
import ManegeUsers from './pages/ManegeUsers/ManegeUsers';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate-docks" element={<GenerateDocks />} />
        <Route path="/templates" element={<Template />} />
        <Route path="/manege-users" element={<ManegeUsers />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
