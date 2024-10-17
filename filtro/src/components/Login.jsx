// Login.js
import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavbarLogin from "./NavbarLogin";
import { motion } from 'framer-motion';
import { formatRut, validateRut } from "@fdograph/rut-utilities";


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
  console.log(".........................................")


console.log("Rut validado para poder iniciar sesion:54735492-3 ")
console.log(validateRut(formatRut("54735492-3")))
console.log("Contraseña: Joan123")


console.log(".........................................")
  const [errorMensaje, seterrorMensaje] = useState({});
  const navigate = useNavigate();

  const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/; // Formato básico de contraseña
    return regex.test(password.trim());
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoError = {};
    if (loginUser.rut === "" || loginUser.password === "") {
      return Swal.fire({
        title: "¡Error!",
        text: `Debes llenar los campos RUT y Contraseña`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    if (!validarPassword(loginUser.password)) {
      return  Swal.fire({
        title: "¡Error!",
        text: "El formato de la contraseña no es válido" ,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      
    }
    if (!validateRut(formatRut(loginUser.rut))) {
      return  Swal.fire({
        title: "¡Error!",
        text: "El formato del Rut no es válido" ,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      
    }
    try {
      
        const response = await axios.post(
          "http://localhost:3000/api/clients/api/login",
          loginUser
        );
        const { token, message, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.nombre);
        localStorage.setItem("userRut", user.rut);

        setloginUser({
          rut: "",
          password: "",
        });
        console.log(message);
        navigate("/clientes-filtrados");
        console.log(response.data);
      
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      console.error("Error al iniciar sesión:", error.response.data.message);
    }
  };

  return (
    <>
      <NavbarLogin />
      <motion.div
       initial={{ x: '-100%', opacity: 0 }} // Comienza fuera de la vista desde la izquierda
       animate={{ x: 0, opacity: 1 }} // Se desplaza a su posición original
       exit={{ x: '100%', opacity: 0 }} // Se mueve fuera de la vista hacia la derecha al salir
       transition={{ duration: 1.5 }} // Duración de la animación
         style={{
          width: "30%",
          height: "30vh",
          margin: "0 auto",
          padding: "20px",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
          backgroundColor: "#f2f2f2",
          marginTop: "50px",
          marginBottom: "50px"
        }}
      >
        <h2>Iniciar Sesión</h2>
        <table style={{width:"100%", display:"flex",
          justifyContent:"center", alignItems:"center"
        }}>
          <tbody>
            <tr>
              <td>
                <form onSubmit={handleSubmit}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <label>Rut:</label>
                        </td>
                        <td>
                          <input
                            onChange={handleChange}
                            style={{ margin: "0" }}
                            type="text"
                            name="rut"
                            value={loginUser.rut}
                            placeholder="12345678-2"
                          />
                         
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label>Contraseña:</label>
                        </td>
                        <td>
                          <input
                            onChange={handleChange}
                            style={{ margin: "0" }}
                            type="password"
                            name="password"
                            value={loginUser.password}
                            placeholder="Ejemplo123"
                          />
                         
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2" style={{ textAlign: "center" }}>
                          <button
                            style={{
                              backgroundColor: "#15616D",
                              marginTop: "10px",
                              width:"50%"
                            }}
                            type="submit"
                          >
                            Iniciar Sesión
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </motion.div>
    </>
  );
};

export default Login;
