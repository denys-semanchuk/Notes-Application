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
import { Search } from 'pages/Search';
import { MyNotes } from 'pages/myNotes';
import { Categories } from 'pages/Categories';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="/" element={<Home />}>
          <Route index element={<Home />} />
          <Route path="archive" element={<Archive />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
        <Route path="search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
        <Route path="notepad/:id" element={<Notepad />} />
        <Route path="about" element={<About />} />
        <Route path="notes" element={<MyNotes />} />
        <Route path="categories" element={<Categories />} />
      </Route>
    </Routes>
  );
};

export default App;