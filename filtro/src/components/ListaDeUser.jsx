import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Swal from "sweetalert2";
import"./estilosTableListUser.css"
import { motion } from 'framer-motion';

import "./login.css";

export const ListaDeUser = () => {
  const [listtaUser, setListaUser] = useState([]);
  const token = localStorage.getItem("token");
  const rutUserLogger = localStorage.getItem("userRut");
 console.log(rutUserLogger)


  const getListaU = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/clients/getUserList?rut=${rutUserLogger}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setListaUser(response.data);
  };

  useEffect(() => {
    getListaU();
  }, []);

  const deleteUserOfList = async (user) => {
    console.log("Eliminando usuario con RUT:", user.rut);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/clients/usuarios/${user.rut}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      getListaU();
      Swal.fire({
        title: "Usuario eliminado!",
        text: "El usuario ha sido eliminado exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.log("Error al eliminar el usuario", error.message);
    }
  };

  // Aquí está la llave faltante:
  return (
    <>
      <Navbar />
      <motion.div 
       initial={{ x: '-100%', opacity: 0 }} // Comienza fuera de la vista desde la izquierda
       animate={{ x: 0, opacity: 1 }} // Se desplaza a su posición original
       exit={{ x: '100%', opacity: 0 }} // Se mueve fuera de la vista hacia la derecha al salir
       transition={{ duration: 1 }} // Duración de la animación
       >
        <h1>Lista de usuarios</h1>
      </motion.div>
      <motion.div
        style={{
          height: "400px",
          marginTop: "30px",
          overflowY: "auto",
          marginBottom: "30px",
          width: "90%",
        }}
        initial={{ x: '-100%', opacity: 0 }} // Comienza fuera de la vista desde la izquierda
        animate={{ x: 0, opacity: 1 }} // Se desplaza a su posición original
        exit={{ x: '100%', opacity: 0 }} // Se mueve fuera de la vista hacia la derecha al salir
        transition={{ duration: 1 }} // Duración de la animación
      >
        <table className="tabla-U" style={{ width: "90%", margin: "0 auto" }}>
          <thead>
            <tr>
              <th
                   style={{
                  backgroundColor: "#15616d",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                Rut
              </th>
              <th
                   style={{
                  backgroundColor: "#15616d",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                Nombre
              </th>
              <th
                style={{
                  backgroundColor: "#15616d",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                Fecha de Registro
              </th>
              <th
                   style={{
                  backgroundColor: "#15616d",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            {listtaUser.map((user) => (
              <tr key={user.id}>
                <td>{user.rut}</td>
                <td>{user.nombre}</td>
                <td>
                  {new Date(user.created_at)
                    .toISOString()
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-")}
                </td>
                <td>
                  <button
                    className="boton-eliminar"
                    onClick={() => deleteUserOfList(user)}
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
      </motion.div>
    </>
  );
};
