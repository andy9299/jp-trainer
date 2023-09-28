import React from 'react';



import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AppNavBar from './nav/AppNavBar';



function App() {
  return (
    <BrowserRouter>
      <AppNavBar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
