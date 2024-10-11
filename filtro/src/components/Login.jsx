// Login.js
import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

const Login = () => {
  const [loginUser, setloginUser] = useState({
    rut: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setloginUser({
      ...loginUser,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (loginUser.rut.length === 0 || loginUser.password.length === 0) {
        alert("Debe completar todos los campos");
       } /*else {
        // Validar rut y contraseña con axios o backend
        // En caso de validación exitosa, redireccionar al dashboard
        // En caso de error, mostrar mensaje de error en pantalla
    } */
    const response = await axios.post(
      "http://localhost:3000/api/clients/api/login",
      loginUser
    );
    const { token, message } = response.data;
    localStorage.setItem("token", token);
    setloginUser({
      rut: "",
      password: "",
    })
    console.log(message)
    navigate("/clientes-filtrados")
    console.log(response.data);
  } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Hubo un error al iniciar sesión. Intente nuevamente.");
    }
    }
  
  return (
    <>
      <div className="container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>Rut:</label>
          <input
            onChange={handleChange}
            style={{ margin: "0" }}
            type="text"
            name="rut"
            value={loginUser.rut}
            required
          />

          {/* <span
            style={{ color: "red", fontSize: "10px", marginBottom: "10px" }}
          >
            Rut incorrecto.{" "}
          </span> */}

          <label>Contraseña:</label>
          <input
            onChange={handleChange}
            style={{ margin: "0" }}
            type="password"
            name="password"
            value={loginUser.password}
            required
          />

       {/*    <span
            style={{ color: "red", fontSize: "10px", marginBottom: "10px" }}
          >
            Contraseña incorrecta.
          </span> */}

          <button style={{ backgroundColor: "green" }} type="submit">
            Iniciar Sesión
          </button>
        </form>
        <input type="checkbox" /> ¿Eres administrador?
       </div>
     {/* <div className="error-container">
        <h2>No tienes acceso como administrador</h2>
      </div> */}
    </>
  );
};

export default Login;
