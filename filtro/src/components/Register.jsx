// Register.js
import React, { useState } from "react";
import "./login.css"; // Asegúrate de importar el archivo CSS
import axios from "axios";
import Navbar from "./Navbar";

const Register = () => {
  const [userR, setUserR] = useState({
    rut: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setUserR({
      ...userR,
      [name]: value,
    });
  };
  const validarRut = (rut) => {
    const regex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
    return regex.test(rut);
  };
  const validarContraseña = (rut) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(rut);
  };
  const handleSunmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
        alert("No se encontró el token de autenticación. Inicia sesión.");
        return;
      }
      if (!validarRut(userR.rut)) {
        throw new Error("El rut ingresado no es válido");
      }
      if (!validarContraseña(userR.password)) {
        throw new Error(
          "La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, una letra minúscula y un número"
        );
      }
    try {
      if (userR.password !== userR.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      const response = await axios.post(
        "http://localhost:3000/api/clients/api/registrarse",
        userR, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }}
      );
      alert("Registro exitoso. Inicie sesión para continuar");
      setUserR({
        rut: "",
        password: "",
        confirmPassword: "",
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error al registrar", error);
      alert("Hubo un error al registrar. Intente nuevamente");
      setUserR({
        rut: "",
        password: "",
        confirmPassword: "",
      });
      return;
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container">
      <h2>Registrar Personal</h2>
      <form onSubmit={handleSunmit}>
        <label>Rut:</label>
        <input
          onChange={handleChange}
          style={{ margin: "0" }}
          type="text"
          name="rut"
          value={userR.rut}
          required
        />
        <span style={{ color: "red", fontSize: "12px" }}>
          Rut invalido. El Rut debe ser formato Rut: 64537483-8
        </span>
        <label>Contraseña:</label>
        <input
          onChange={handleChange}
          style={{ margin: "0" }}
          type="password"
          name="password"
          value={userR.password}
          required
        />
        <span style={{ color: "red", fontSize: "12px" }}>
          La contraseña debe tener un minimo de 6 caracteres
        </span>

        <label>Repetir Contraseña:</label>
        <input
          onChange={handleChange}
          style={{ margin: "0" }}
          type="password"
          name="confirmPassword"
          value={userR.confirmPassword}
          required
        />
        <span style={{ color: "red", fontSize: "12px" }}>
          La contraseña que ingresaste no coincide con la contraseña anterior
        </span>

        <span style={{ marginTop: "10px" }}>
          ¿Registrar Nuevo Administrador?
        </span>
        <span>
          <input
            style={{
              textAlign: "initial",
              marginLeft: "10px",
              marginTop: "10px",
              backgroundColor: "blue",
              color: "white",
              cursor: "pointer",
            }}
            type="checkbox"
          />
        </span>
        <button
          style={{ backgroundColor: "green", marginTop: "10px" }}
          type="submit"
        >
          Registrarse
        </button>
      </form>
    </div>
    </>
  );
};

export default Register;
