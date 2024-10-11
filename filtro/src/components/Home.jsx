// Home.js
import React from 'react';
import Login from './Login';
import Register from './Register';
import './login.css'; // Asegúrate de importar el archivo CSS
import Navbar from './Navbar';

const Home = () => {
    return (
        <div>
            {/* <Navbar/> */}
            <h1>Bienvenido</h1>
            <Login />
            {/* <Register /> */}
        </div>
    );
};

export default Home;
