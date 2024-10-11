import React from 'react';
import { Routes, Route } from 'react-router-dom';
/* import Home from './Home';  */// Importa tus componentes
import About from './About';
import IniciarSesion from '../components/IniciarSesion';

function App() {
  return (
    <Routes>
      {/* <Route path="/iniciarsesion" element={<IniciarSesion />} /> */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );
}

export default App;
