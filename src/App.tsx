import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Dashboard from 'pages/Dashboard';
import './styles/global.css';
import { Home } from 'pages/Home';
import { Notepad } from 'pages/Notepad';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<Home />} />
        <Route path="notepad/:id" element={<Notepad />} />
      </Route>
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default App;