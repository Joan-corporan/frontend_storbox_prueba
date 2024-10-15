// Navbar.js
import React from "react";
import "./login.css";
import { useNavigate } from "react-router";

const Navbar = () => {
  const navegate = useNavigate();
  
  /* const nombreUserLogiado=  localStorage.setItem("userName", user.nombre); */
  const handleLogout = () => {
    // Elimina el token del almacenamiento local
    localStorage.removeItem("token");
    /* localStorage.removeItem("userName", user.nombre); */


    // Redirige al usuario a la página de inicio de sesión
    navegate("/login");
  };
  const btnRegistrarCliente = () => {
    navegate("/register");
  };
  const btnListaUsers = () => {
    navegate("/lista-users");
  };
  const btnInicio = () => {
    navegate("/clientes-filtrados");
  };
  return (
    <nav
      style={{
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        width: "100%",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        transition: "background-color 0.3s ease",
      }}
      className="navbar"
    >
      <div style={{ marginLeft: "20px" }} className="navbar-title">
        Gestor de Clientes
      </div>
      {/* <p>{nombreUserLogiado}</p> */}
      <div className="navbar-options">
        <button
          onClick={() => {
            btnInicio();
          }}
          style={{ marginRight: "10px" }}
          className="register-button"
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
          className="register-button"
          onClick={() => {
            btnListaUsers();
          }}
          style={{
            /* backgroundColor: "#218838", */
            marginRight: "10px",
            marginLeft: "10px",
          }}
        >
          Lista de Usuarios
        </button>

        <button
          onClick={() => {
            handleLogout();
          }}
          style={{
            backgroundColor: "red",
            marginLeft: "5px",
            marginRight: "15px",
          }}
          className="login-button"
        >
          Cerrar Sesion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
