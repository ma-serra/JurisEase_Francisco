import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DocsEditor from './pages/DocsEditor';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs-editor" element={<DocsEditor />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
