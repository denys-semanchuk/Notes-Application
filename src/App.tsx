import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Dashboard from 'pages/Dashboard';
import './styles/global.css';
import { Home } from 'pages/Home';
import { Notepad } from 'pages/Notepad';
import NotFound from 'pages/404';
import About from 'pages/about';
import { Archive } from 'pages/archive';
import { Favorites } from './pages/Favorites';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="/" element={<Home />}>
          <Route index element={<Home />} />
          <Route path="archive" element={<Archive />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="notepad/:id" element={<Notepad />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;