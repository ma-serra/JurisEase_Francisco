import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import DocsEditor from './pages/DocsEditor/DocsEditor';
import GenerateDocks from './pages/DocsEditor/GenerateDocks/GenerateDocks';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs-editor" element={<DocsEditor />} />
        <Route path="/generate-docks" element={<GenerateDocks />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
