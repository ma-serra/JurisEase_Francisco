import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import DocsEditor from './pages/DocsEditor';
import Test from './pages/Test';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs-editor" element={<DocsEditor />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
