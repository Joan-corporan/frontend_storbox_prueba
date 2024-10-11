import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import App from './App.jsx';
import './index.css';
import Index from './Index.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    {/* <BrowserRouter> */}
      {/* <App /> */}
      <Index/>
    {/* </BrowserRouter> */}
  </React.StrictMode>
  
);
