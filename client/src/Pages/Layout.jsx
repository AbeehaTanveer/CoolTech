import React from 'react';
import Navbar from '../components/Navbar'; // Make sure path is correct
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div >
      <div style={{backgroundColor:"#1a1a1a"}}>

      <Navbar />
      <Outlet />
      </div>
     
    
    </div>
  );
};

export default Layout;
