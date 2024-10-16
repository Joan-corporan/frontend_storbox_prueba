// Navbar.js
import React from "react";
import "./login.css"; 
import { useNavigate } from "react-router";

const NavbarLogin = () => {
  const navegate = useNavigate();
  const handleLogout = () => {
    // Elimina el token del almacenamiento local
    localStorage.removeItem("token");

    // Redirige al usuario a la página de inicio de sesión
    navegate("/login");
  };
  const btnRegistrarCliente = () => {
    navegate("/register");
  };  const btnListaUsers = () => {
    navegate("/lista-users");
  };
  const btnInicio=()=>{
    navegate("/clientes-filtrados");
  }
  return (
    <nav style={{
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        /* height: "50px",
        position: "fixed",
        top: "0",
        left: "0", */
        width: "100%",
        /* zIndex: "100", */
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        transition: "background-color 0.3s ease",
  
    }} className="Login">
      <div style={{marginLeft:"20px"}} className="navbar-title">Gestor de Clientes</div>
      {/* <div className="navbar-options">
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
        <button onClick={()=>{ btnListaUsers()}}
          style={{
            backgroundColor: "yellowgreen",
            marginRight: "10px",
            marginLeft: "10px",
          }}
        >
          Lista de Usuarios
        </button>

        <button onClick={()=>{handleLogout()}}
          style={{ backgroundColor: "red", marginLeft: "5px",marginRight: "15px" }}
          className="login-button"
        >
          Cerrar Sesion
        </button>
      </div> */}
    </nav>
  );
};

export default NavbarLogin;
