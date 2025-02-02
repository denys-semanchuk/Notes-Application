import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Dashboard from 'pages/Dashboard';
import './styles/global.css';
import { Home } from 'pages/Home';
import { Notepad } from 'pages/Notepad';
import NotFound from 'pages/404';
import About from 'pages/about';
import { Archive } from 'pages/archive';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<Home />} />
        <Route path="notepad/:id" element={<Notepad />} />
        <Route path="about" element={<About />} />
        <Route path="archive" element={<Archive />} />

      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;