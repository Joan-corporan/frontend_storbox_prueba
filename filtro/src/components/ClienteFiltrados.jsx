import React, { useState } from "react";
import axios from "axios";
import "./ClientesFiltrados.css"; // Estilos externos
import "./estilosTableClienteFiltrados.css"; // Estilos externos

import FormularioCliente from "./FormularioCliente";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import Navbar from "./Navbar";

const ClientesFiltrados = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Almacena el cliente seleccionado para editar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalRegitroCliente, setMostrarModalRegistro] = useState(false);

  const [setClienteEliminar] = useState(null);
  const [filters, setFilters] = useState({
    id_sucursal: "",
    nombre_cliente: "",
    email_cliente: "",
    telefono_cliente: "",
    fecha_desde: "",
    fecha_hasta: "",
    rut_cliente: "",
  });

  // Validaciones
  const [errores, setErrores] = useState({});

  const [errorEditar, seterrorEditar] = useState({}); ///////////////////////////////////////////////////

  const validarEmail = (email) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  const validarNombre = (nombre) => {
    const regex = /^[a-zA-Zñ��áéíóúÁÉÍÓ��\s]+$/;
    return regex.test(nombre);
  };
  const validarRut = (rut) => {
    const regex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
    return regex.test(rut);
  };
  const validarSucursal = (sucursal) => {
    const regex = /^[0-9]+$/;
    return regex.test(sucursal);
  };
  const validarTelefono = (telefono) => {
    const regex = /^(\+56)?9[0-9]{8}$/;
    return regex.test(telefono);
  };
  const validarFechaDesde = (fecha) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(fecha);
  };

  const validarFechaHasta = (fecha) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(fecha);
  };
  const validarRangoFechas = (fechaDesde, fechaHasta) => {
    return new Date(fechaDesde) <= new Date(fechaHasta);
  };

  const limpiarfiltros = () => {
    setFilters({
      id_sucursal: "",
      nombre_cliente: "",
      email_cliente: "",
      telefono_cliente: "",
      fecha_desde: "",
      fecha_hasta: "",
      rut_cliente: "",
    });
    setErrores("");
  };
  const limpiarGrilla = () => {
    setClientes([]);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const token = localStorage.getItem("token");
  /* console.log(token) */
  if (!token) {
    alert("No se encontró el token de autenticación. Inicia sesión.");
    return;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (filters.id_sucursal && !validarSucursal(filters.id_sucursal)) {
      Swal.fire({
        title: "¡Error!",
        text: "Sucursal inválida. Solo tipo números positivos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setLoading(false);
      return;
    }
    if (filters.nombre_cliente && !validarNombre(filters.nombre_cliente)) {
      Swal.fire({
        title: "¡Error!",
        text: "Nombre inválido. Solo tipo texto",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setLoading(false);
      return;
    }
    if (filters.fecha_desde && !validarFechaDesde(filters.fecha_desde)) {
      Swal.fire({
        title: "¡Error!",
        text: "Fecha desde inválida. Debe ser formato fecha",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setLoading(false);
      return;
    }
    if (filters.fecha_hasta && !validarFechaHasta(filters.fecha_hasta)) {
      Swal.fire({
        title: "¡Error!",
        text: "Fecha hasta inválida. Debe ser formato fecha",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setLoading(false);
      return;
    }
    if (
      filters.fecha_desde &&
      filters.fecha_hasta &&
      !validarRangoFechas(filters.fecha_desde, filters.fecha_hasta)
    ) {
      Swal.fire({
        title: "¡Error!",
        text: "La fecha 'desde' no puede ser mayor que la fecha 'hasta'.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setLoading(false);
      return;
    }
    if (filters.email_cliente && !validarEmail(filters.email_cliente)) {
      Swal.fire({
        title: "¡Error!",
        text: "Email inválido. Debe ser formato email",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setLoading(false);
      return;
    }
    if (
      filters.telefono_cliente &&
      !validarTelefono(filters.telefono_cliente)
    ) {
      Swal.fire({
        title: "¡Error!",
        text: "Teléfono inválido. Debe tener 9 dígitos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setLoading(false);
      return;
    }
    if (filters.rut_cliente && !validarRut(filters.rut_cliente)) {
      Swal.fire({
        title: "¡Error!",
        text: "RUT inválido. Debe ser formato rut",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setLoading(false);
      return;
    }
    // Formatear las fechas
    const fechaDesdeFormateada = filters.fecha_desde
      ? new Date(filters.fecha_desde).toISOString().split("T")[0]
      : "";
    const fechaHastaFormateada = filters.fecha_hasta
      ? new Date(filters.fecha_hasta).toISOString().split("T")[0]
      : "";

    try {
      if (
        filters.email_cliente === "" &&
        filters.rut_cliente === "" &&
        filters.id_sucursal === "" &&
        filters.nombre_cliente === "" &&
        filters.fecha_desde === "" &&
        filters.fecha_hasta === "" &&
        filters.telefono_cliente === ""
      ) {
        return Swal.fire({
          title: "¡Error!",
          text: "Debes colocar valores para poder filtrar",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
      const { data } = await axios.get(
        "http://localhost:3000/api/clients/filtro",
        {
          params: {
            ...filters,
            fecha_desde: fechaDesdeFormateada,
            fecha_hasta: fechaHastaFormateada,
          },
          headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de incluir el token aquí
          },
        }
      );
      setClientes(data.detail);
      setErrores("");
    } catch (err) {
      /* setError("Error al obtener los datos de clientes."); */
      Swal.fire({
        title: "¡Error!",
        text: "Cliente no existe.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };
  // Función para generar el archivo Excel
  const exportarExcel = () => {
    if(clientes.length===0){
      Swal.fire({
        title: "��Error!",
        text: "No hay clientes para exportar a Excel.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }else{
       const ws = XLSX.utils.json_to_sheet(clientes);

    // Formatear encabezados
    const encabezados = Object.keys(clientes[0]);
    XLSX.utils.sheet_add_aoa(ws, [encabezados], { origin: "A1" });

    // Ajuste automático de las columnas
    const columnas = Object.keys(clientes[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...clientes.map((c) => (c[key] ? c[key].toString().length : 0))
      ),
    }));
    ws["!cols"] = columnas;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");

    // Estilo básico (opcional, más detalles en la documentación de XLSX)
    ws["A1"].s = {
      font: { bold: true },
      alignment: { horizontal: "center" },
    };

    XLSX.writeFile(wb, "clientes.xlsx");
    }
   
  };

  const abrirModalEdicion = (cliente) => {
    setClienteSeleccionado(cliente); // Establece el cliente a editar
    console.log(cliente);
    setMostrarModal(true); // Muestra el modal
  };
  const EliminarCliente = async (cliente) => {
    
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/clients/${cliente.rut_cliente}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar token en el header
          },
        }
      );
      console.log(response)
      if (response.status === 200) {
        setClientes(
          clientes.filter((c) => c.rut_cliente !== cliente.rut_cliente)
        );
    
      }

     
        Swal.fire({
            title: "¡Éxito!",
            text: `${response.data.message}`,
            icon: "success",
            confirmButtonText: "Aceptar",
        });
    
    } catch (error) {
      console.error('Error al eliminar el cliente', error);
      Swal.fire({
        title: "¡Error!",
        text: error.response?.data?.message || "No se pudo eliminar el cliente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };


  const cerrarModal = () => {
    setMostrarModal(false); // Oculta el modal
    setClienteSeleccionado(null); // Limpia el cliente seleccionado
  };

  const manejarEdicion = (e) => {
    const { name, value } = e.target;
    setClienteSeleccionado({
      ...clienteSeleccionado,
      [name]: value,
    });
  };
  const guardarCliente = async () => {
    const errorealEditar = {};
    if (
      clienteSeleccionado.email_cliente &&
      !validarEmail(clienteSeleccionado.email_cliente)
    ) {
      errorealEditar.email_cliente = "Email inválido. Debe ser formato email";
    }
    if (
      clienteSeleccionado.telefono_cliente &&
      !validarTelefono(clienteSeleccionado.telefono_cliente)
    ) {
      errorealEditar.telefono_cliente =
        "Teléfono inválido. Debe tener 9 dígitos";
    }
    if (
      clienteSeleccionado.rut_cliente &&
      !validarRut(clienteSeleccionado.rut_cliente)
    ) {
      errorealEditar.rut_cliente = "RUT inválido. Debe ser formato rut";
    }
    if (
      clienteSeleccionado.nombre_cliente &&
      !validarNombre(clienteSeleccionado.nombre_cliente)
    ) {
      errorealEditar.nombre_cliente = "Nombre inválido. Solo tipo texto";
    }
    if (
      clienteSeleccionado.id_sucursal &&
      !validarSucursal(clienteSeleccionado.id_sucursal)
    ) {
      errorealEditar.id_sucursal = "Sucursal inválido. Solo tipo número";
    }
    if (Object.keys(errorealEditar).length > 0) {
      seterrorEditar(errorealEditar);
      return;
    }
    try {
      // Realiza la petición PUT al backend con los datos del cliente seleccionado
      const response = await axios.put(
        `http://localhost:3000/api/clients/${clienteSeleccionado.rut_cliente}`,
        clienteSeleccionado,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar token en el header
          },
        }
      );

      // Si la respuesta es exitosa, actualiza la lista de clientes
      if (response.status === 200) {
        const nuevosClientes = clientes.map((cliente) =>
          cliente.rut_cliente === clienteSeleccionado.rut_cliente
            ? clienteSeleccionado
            : cliente
        );
        seterrorEditar({});
        setClientes(nuevosClientes);
        cerrarModal(); // Cierra el modal después de guardar los cambios
        Swal.fire({
          title: "¡Éxito!",
          text: `${response.data.message}`,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.log("Error al guardar los cambios:", error.response.data.message);
      Swal.fire({
        title: "¡Error!",
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setError("Hubo un problema al guardar los cambios.");
    }
    
  };

  return (
    <>
      <Navbar />
      <div
        style={{ padding: "0", boxShadow: "1px 1px 2px black" , marginTop:"20px" }}
        className="clientes-filtrados-container"
      >
        <div className="rowContainer">
          <div>
            <form className="filter-form" onSubmit={handleSubmit}>
              <table>
                <thead>
                  <tr>
                    <th>Sucursal</th>
                    <th>Nombre</th>
                    <th>RUT</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Fecha Desde</th>
                    <th>Fecha Hasta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                       
                        id="id_sucursal"
                        name="id_sucursal"
                        value={filters.id_sucursal}
                        onChange={handleChange}
                      >
                        <option disabled value="">
                          Selecciona una sucursal
                        </option>
                        <option value="1">Sucursal 1</option>
                        <option value="2">Sucursal 2</option>
                        <option value="3">Sucursal 3</option>
                      </select>
                
                    </td>
                    <td>
                      <input
                        type="text"
                        id="nombre_cliente"
                        name="nombre_cliente"
                        value={filters.nombre_cliente}
                        onChange={handleChange}
                        placeholder="Nombre del cliente"
                      />
                
                    </td>
                    <td>
                      <input
                        type="text"
                        id="rut_cliente"
                        name="rut_cliente"
                        value={filters.rut_cliente}
                        onChange={handleChange}
                        placeholder="RUT del cliente"
                      />
                  
                    </td>
                    <td>
                      <input
                        type="text"
                        id="telefono_cliente"
                        name="telefono_cliente"
                        value={filters.telefono_cliente}
                        onChange={handleChange}
                        placeholder="Teléfono del cliente"
                      />
                   
               
                    </td>
                    <td>
                      <input
                        type="text"
                        id="email_cliente"
                        name="email_cliente"
                        value={filters.email_cliente}
                        onChange={handleChange}
                        placeholder="ejemplo.123@gmail.com"
                      />
               
                    </td>
                    <td>
                      <input
                        type="date"
                        id="fecha_desde"
                        name="fecha_desde"
                        value={filters.fecha_desde}
                        onChange={handleChange}
                      />
                  
                    </td>
                    <td>
                      <input
                        type="date"
                        id="fecha_hasta"
                        name="fecha_hasta"
                        value={filters.fecha_hasta}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                style={{
                  backgroundColor: "#15616D",
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
                type="submit"
                className="btn-submit"
              >
                Buscar Cliente
              </button>
              <button
                type="button"
                className="rojo"
                onClick={() => limpiarfiltros()}
                style={{ marginTop: "10px", marginLeft: "10px", backgroundColor:"#333" }}
              >
                Limpiar Filtros
              </button>
            </form>
          </div>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="clientes-grid" style={{width:"90%"}}>
        
          <div className="contenedor_botones">
            <button className="rojo botton" onClick={() => limpiarGrilla()}>
              Limpiar grilla
            </button>
            <button className="Naranja botton" onClick={exportarExcel}>
              Generar Planilla
            </button>
          </div>
       
       {/*  {clientes.length > 0 ? ( */}
          <div
            style={{
              overflowY: "auto",
              marginBottom: "30px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <table
              className="table-filter"
              /* id="table-height" */ style={{
                textAlign: "center",
                width: "90%",
                borderCollapse: "collapse",
              }}
            >
              <thead style={{}}>
                <tr>
                  <th
                    style={{
                      /*  backgroundColor: "#333", */
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Sucursal
                  </th>
                  <th
                    style={{
                      /* backgroundColor: "#333", */
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Nombre
                  </th>
                  <th
                    style={{
                      /* backgroundColor: "#333", */
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      /* backgroundColor: "#333", */
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Teléfono
                  </th>
                  <th
                    style={{
                      /* backgroundColor: "#333", */
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    RUT
                  </th>
                  <th
                    style={{
                      /* backgroundColor: "#333", */
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Fecha Registro
                  </th>
                  <th
                    style={{
                      /* backgroundColor: "#333", */
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
                {clientes.map((cliente) => (
                  <tr key={cliente.rut_cliente}>
                    <td>{cliente.id_sucursal}</td>
                    <td>{cliente.nombre_cliente}</td>
                    <td>{cliente.email_cliente}</td>
                    <td>{cliente.telefono_cliente}</td>
                    <td>{cliente.rut_cliente}</td>
                    <td>
                      {new Date(cliente.fecha_registro)
                        .toISOString()
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          /* height: "100%", */
                        }}
                      >
                        <button
                        style={{backgroundColor:"#15616D"}}
                          /* className="boton-eliminar" */
                          onClick={() => abrirModalEdicion(cliente)}
                        >
                          <img
                            style={{ width: "15px" }}
                            src="public/pencil.svg"
                            alt="icon"
                          />
                        </button>
                        <button
                          style={{ marginLeft: "5px" }}
                          className="boton-eliminar"
                          onClick={() => EliminarCliente(cliente)}
                        >
                          <img
                            style={{ width: "15px" }}
                            src="public/delete.svg"
                            alt="icon"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    
      </div>

      {/* Modal para editar cliente */}
      {mostrarModal && (
        <div className="modal">
          <div style={{backgroundColor:"#F4F4F4"}} className="modal-content">
            <span style={{fontSize:"20px", cursor:"pointer"}} className="close" onClick={cerrarModal}>
              &times;
            </span>
            <h4 style={{ margin: "5px", textAlign: "center" }}>
              Actualizar Cliente
            </h4>
            <form style={{display:"flex",justifyContent:"center"}}>
              <table className="form-table">
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="nombre_cliente">Nombre</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="nombre_cliente"
                        name="nombre_cliente"
                        value={clienteSeleccionado.nombre_cliente}
                        onChange={manejarEdicion}
                      />
                      {errorEditar.nombre_cliente && (
                        <span className="error">
                          {errorEditar.nombre_cliente}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="email_cliente">Email</label>
                    </td>
                    <td>
                      <input
                        type="email"
                        id="email_cliente"
                        name="email_cliente"
                        value={clienteSeleccionado.email_cliente}
                        onChange={manejarEdicion}
                      />
                      {errorEditar.email_cliente && (
                        <span className="error">
                          {errorEditar.email_cliente}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="telefono_cliente">Teléfono</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="telefono_cliente"
                        name="telefono_cliente"
                        value={clienteSeleccionado.telefono_cliente}
                        onChange={manejarEdicion}
                      />
                      {errorEditar.telefono_cliente && (
                        <span className="error">
                          {errorEditar.telefono_cliente}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="rut_cliente">RUT</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="rut_cliente"
                        name="rut_cliente"
                        value={clienteSeleccionado.rut_cliente}
                        onChange={manejarEdicion}
                      />
                      {errorEditar.rut_cliente && (
                        <span className="error">{errorEditar.rut_cliente}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="id_sucursal">Sucursal</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="id_sucursal"
                        name="id_sucursal"
                        value={clienteSeleccionado.id_sucursal}
                        onChange={manejarEdicion}
                      />
                      {errorEditar.id_sucursal && (
                        <span className="error">{errorEditar.id_sucursal}</span>
                      )}
                    </td>
                  </tr>
                  <tr  >
                    <td  colSpan="2" className="button-row">
                    </td>
                      <button style={{backgroundColor:"#15616D"}}
                        type="button"
                        className="btn-guardar"
                        onClick={guardarCliente}
                      >
                        Guardar
                      </button>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientesFiltrados;
