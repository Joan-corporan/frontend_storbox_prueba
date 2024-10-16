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

  const handleSubmit = async (e) => {
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
        text: `Debes llenar los campos RUT, Nombre y Contraseña`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    if (!token) {
      return Swal.fire({
        title: "¡Error!",
        text:"No se encontró el token de autenticación. Inicia sesión."   ,
        icon: "error",
        confirmButtonText: "Aceptar",
      }); 
      
      
    }
    if (!validarRut(userR.rut)) {
      return Swal.fire({
        title: "¡Error!",
        text:"El rut ingresado no es válido"   ,
        icon: "error",
        confirmButtonText: "Aceptar",
      });  ;
    }
    if (!validarContraseña(userR.password)) {
      return Swal.fire({
        title: "¡Error!",
        text:"La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, una letra minúscula y un número"   ,
        icon: "error",
        confirmButtonText: "Aceptar",
      }); 
    }
    if(!validarNombre(userR.name)){
      return Swal.fire({
        title: "¡Error!",
        text: "El nombre ingresado no es válido",
        icon: "error",
        confirmButtonText: "Aceptar",
      }); 
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
      <div style={{
        width: "40%",
        height:"65vh",
        margin: "0 auto",
        padding: "20px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        borderRadius: "5px",
        backgroundColor: "#f2f2f2",
        marginTop: "50px",
        marginBottom: "50px",
      }} /* className="container" */>
        <h2>Registrar Personal</h2>
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
  <table style={{display:"flex",justifyContent:"center"}} className="form-table-register">
    <tbody>
      <tr>
        <td>
          <label htmlFor="rut">Rut:</label>
        </td>
        <td>
          <input
            onChange={handleChange}
            type="text"
            name="rut"
            value={userR.rut}
            placeholder="12345678-2"
            /* required */
          />
        
        </td>
      </tr>
      <tr>
        <td>
          <label htmlFor="name">Nombre:</label>
        </td>
        <td>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            value={userR.name}
            placeholder="Pedro"
            /* required */
          />
        
        </td>
      </tr>
      <tr>
        <td>
          <label htmlFor="password">Contraseña:</label>
        </td>
        <td>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            value={userR.password}
            placeholder="Ejemplo123"
            /* required */
          />
        
        </td>
      </tr>
      <tr>
        <td>
          <label htmlFor="confirmPassword">Repetir Contraseña:</label>
        </td>
        <td>
          <input
            onChange={handleChange}
            type="password"
            name="confirmPassword"
            value={userR.confirmPassword}
            placeholder="Ejemplo123"
            /* required */
          />
        </td>
      </tr>
      <tr>
        <td colSpan="2" className="button-row">
          <button
            style={{ backgroundColor: "#15616D", marginTop: "10px" }}
            type="submit"
          >
            Registrarse
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</form>

      </div>
    </>
  );
};

export default Register;
