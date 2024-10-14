import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./login.css"

export const ListaDeUser = () => {
  const [listtaUser, setListaUser] = useState([]);
  const token = localStorage.getItem("token");
  try {
    useEffect(() => {
      const getListaU = async () => {
        const response = await axios.get(
          "http://localhost:3000/api/clients/getUserList",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setListaUser(response.data);
        console.log(listtaUser);
        console.log(listtaUser);
      };
      getListaU();
    }, []);
  } catch (error) {
    console.log(error);
    Swal.fire({
      title: "¡Error!",
      text: `${error.response.data.message}`,
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
  return (
    <>
      <Navbar />
      <div
  style={{
    height: "400px",
    marginTop: "30px",
    overflowY: "auto",
    marginBottom: "30px",
    width: "100%",
  }}
>
  <table style={{ width: "90%", margin: "0 auto" }}>
    <thead>
      <tr>
        <th style={{ backgroundColor: "#333", position: "sticky", top: 0, zIndex: 1 }}>Rut</th>
        <th style={{ backgroundColor: "#333", position: "sticky", top: 0, zIndex: 1 }}>Nombre</th>
        <th style={{ backgroundColor: "#333", position: "sticky", top: 0, zIndex: 1 }}>Fecha de Registro</th>
        <th style={{ backgroundColor: "#333", position: "sticky", top: 0, zIndex: 1 }}>Opciones</th>
      </tr>
    </thead>
    <tbody>
      {listtaUser.map((user) => (
        <tr key={user.id}>
          <td>{user.rut}</td>
          <td>{user.nombre}</td>
          <td>{user.created_at}</td>
          <td>
            <button
              className="boton-eliminar"
              onClick={() => eliminarUser(user.id)}
            >
              <img
                style={{ width: "15px" }}
                src="public/delete.svg"
                alt="icon"
              />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    </>
  );
};
