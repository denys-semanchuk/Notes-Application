import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;