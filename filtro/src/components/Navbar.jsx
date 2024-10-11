// Navbar.js
import React from "react";
import "./login.css"; 
import { useNavigate } from "react-router";

const Navbar = () => {
  const navegate = useNavigate();
  const handleLogout = () => {
    // Elimina el token del almacenamiento local
    localStorage.removeItem("token");

    // Redirige al usuario a la página de inicio de sesión
    navegate("/login");
  };
  const btnRegistrarCliente = () => {
    navegate("/register");
  };
  const btnInicio=()=>{
    navegate("/clientes-filtrados");
  }
  return (
    <nav className="navbar">
      <div className="navbar-title">Gestor de Clientes</div>
      <div className="navbar-options">
        <button
        onClick={() => {
            btnInicio();
          }}
          style={{ backgroundColor: "red", marginRight: "10px" }}
          className="login-button"
        >
          Inicio
        </button>

        <button
          onClick={() => {
            btnRegistrarCliente();
          }}
          className="register-button"
        >
          Registrar Personal
        </button>
        <button
          style={{
            backgroundColor: "yellowgreen",
            marginRight: "10px",
            marginLeft: "10px",
          }}
        >
          Lista de Usuarios
        </button>

        <button onClick={()=>{handleLogout()}}
          style={{ backgroundColor: "red", marginLeft: "10px" }}
          className="login-button"
        >
          Cerrar Sesion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
