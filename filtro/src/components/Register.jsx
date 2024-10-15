// Register.js
import React, { useState } from "react";
import "./login.css"; // Asegúrate de importar el archivo CSS
import axios from "axios";
import Swal from "sweetalert2";

import Navbar from "./Navbar";

const Register = () => {
  const [errores, setErrores] = useState({});

  const [userR, setUserR] = useState({
    rut: "",
    name:"",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
   /*  console.log(e); */
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
  const validarContraseña = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(password);
  };
  const validarNombre = (nombre) => {
    const regex =  /^[a-zA-ZñáéíóúÁÉÍÓ��\s]+$/;
    return regex.test(nombre);  
  };

  const handleSunmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const nuevoErrores = {};
    if (
      userR.rut === "" ||
      userR.password === "" ||
      userR.confirmPassword === ""
    ) {
      return Swal.fire({
        title: "¡Error!",
        text: `Debes llenar los campos RUT y Contraseña`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    if (!token) {
      alert("No se encontró el token de autenticación. Inicia sesión.");
      return;
    }
    if (!validarRut(userR.rut)) {
      nuevoErrores.rut = "El rut ingresado no es válido";
    }
    if (!validarContraseña(userR.password)) {
      nuevoErrores.password =
        "La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, una letra minúscula y un número";
    }
    if(!validarNombre(userR.name)){
        nuevoErrores.name = "El nombre ingresado no es válido";
    }
    if (userR.password !== userR.confirmPassword) {
      return Swal.fire({
        title: "¡Error!",
        text: `"Las contraseñas no coinciden"`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    try {
      if (Object.keys(nuevoErrores).length > 0) {
        setErrores(nuevoErrores);
        console.log(nuevoErrores);
        console.log(errores.id_sucursal);
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/clients/api/registrarse",
          userR,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setUserR({
          rut: "",
          name:"",
          password: "",
          confirmPassword: "",
        });
        console.log(response)
        Swal.fire({
            title: '¡Exito!',
            text: `${response.data.message}`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          setErrores("");
      }
    } catch (error) {
      console.error("Error al registrar", error);
      Swal.fire({
        title: '¡Error!',
        text: `${error.response.data.message}`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
   
      
      return;
    }
  };

  return (
    <>
      <Navbar />
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
            /* required */
          />
          {errores.rut && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errores.rut}
            </span>
          )}
           <label>Nombre:</label>
          <input
            onChange={handleChange}
            style={{ margin: "0" }}
            type="text"
            name="name"
            value={userR.name}
            /* required */
          />
          {errores.name && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errores.name}
            </span>
          )}
          <label>Contraseña:</label>
          <input
            onChange={handleChange}
            style={{ margin: "0" }}
            type="password"
            name="password"
            value={userR.password}
            /* required */
          />
          {errores.password && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errores.password}
            </span>
          )}

          <label>Repetir Contraseña:</label>
          <input
            onChange={handleChange}
            style={{ margin: "0" }}
            type="password"
            name="confirmPassword"
            value={userR.confirmPassword}
            /* required */
          />
          {/* {errores.password&& <span style={{ color: "red", fontSize: "12px" }}>
          La contraseña que ingresaste no coincide con la contraseña anterior
        </span>} */}

          {/* <span style={{ marginTop: "10px" }}>
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
          </span> */}
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
