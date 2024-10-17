// Login.js
import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
  const [errorMensaje, seterrorMensaje] = useState({});
  const navigate = useNavigate();
  const validarRut = (rut) => {
    const regex = /^[0-9]{7,8}-[0-9Kk]{1}$/; // Formato básico de RUT
    return regex.test(rut.trim());
  };
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
      nuevoError.password = "El formato de la contraseña no es válido";
    }
    if (!validarRut(loginUser.rut)) {
      nuevoError.password = "El formato del Rut no es válido";
    }
    try {
      if (Object.keys(nuevoError).length > 0) {
        seterrorMensaje(nuevoError);
        return;
      } else {
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
      }
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
      <div
         style={{
          width: "40%",
          height: "65vh",
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
                          {errorMensaje.rut && (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errorMensaje.rut}
                            </span>
                          )}
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
                          {errorMensaje.password && (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errorMensaje.password}
                            </span>
                          )}
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
      </div>
    </>
  );
};

export default Login;
