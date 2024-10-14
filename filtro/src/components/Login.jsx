// Login.js
import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 
import NavbarLogin from "./NavbarLogin";


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
      if(loginUser.rut==="" || loginUser.password===""){
        return Swal.fire({
          title: '¡Error!',
          text: `Debes llenar los campos RUT y Contraseña`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }

    try {
       
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
    Swal.fire({
        title: '¡Error!',
        text: `${error.response.data.message}`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      console.error("Error al iniciar sesión:", error.response.data.message);
      
    }
    }
  
  return (
    <>
    <NavbarLogin/>
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
            /* required */
          />

         

          <label>Contraseña:</label>
          <input
            onChange={handleChange}
            style={{ margin: "0" }}
            type="password"
            name="password"
            value={loginUser.password}
            /* required */
          />

      

          <button style={{ backgroundColor: "green", marginTop:"10px" }} type="submit">
            Iniciar Sesión
          </button>
        </form>
       
       </div>
     
    </>
  );
};

export default Login;
