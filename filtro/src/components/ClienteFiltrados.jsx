import React, { useState } from "react";
import axios from "axios";
import "./ClientesFiltrados.css"; // Estilos externos
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
  const [clienteEliminado, setClienteEliminar] = useState(null);
  const [filters, setFilters] = useState({
    id_sucursal: "",
    nombre_cliente: "",
    email_cliente: "",
    telefono_cliente: "",
    fecha_desde: "",
    fecha_hasta: "",
    rut_cliente: "",
  });
  const token = localStorage.getItem("token");
  /* console.log(token) */
  if (!token) {
    alert("No se encontró el token de autenticación. Inicia sesión.");
    return;
  }
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
    setErrores("")
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const nuevosErrores = {};

    // Validaciones
    if (filters.id_sucursal && !validarSucursal(filters.id_sucursal)) {
      nuevosErrores.id_sucursal = "Sucursal inválido. Solo tipo número";
    }
    if (filters.nombre_cliente && !validarNombre(filters.nombre_cliente)) {
      nuevosErrores.nombre_cliente = "Nombre inválido. Solo tipo texto";
    }
    if (filters.fecha_desde && !validarFechaDesde(filters.fecha_desde)) {
      nuevosErrores.fecha_desde = "Fecha inválido. Debe ser formato fecha";
    }
    if (filters.fecha_hasta && !validarFechaHasta(filters.fecha_hasta)) {
      nuevosErrores.fecha_hasta = "Fecha inválido. Debe ser formato fecha";
    }
    if (
      filters.fecha_desde &&
      filters.fecha_hasta &&
      !validarRangoFechas(filters.fecha_desde, filters.fecha_hasta)
    ) {
      nuevosErrores.rango_fechas =
        "La fecha 'desde' no puede ser mayor que la fecha 'hasta'.";
    }
    if (filters.email_cliente && !validarEmail(filters.email_cliente)) {
      nuevosErrores.email_cliente = "Email inválido. Debe ser formato email";
    }
    if (
      filters.telefono_cliente &&
      !validarTelefono(filters.telefono_cliente)
    ) {
      nuevosErrores.telefono_cliente =
        "Teléfono inválido. Debe tener 9 dígitos";
    }
    if (filters.rut_cliente && !validarRut(filters.rut_cliente)) {
      nuevosErrores.rut_cliente = "RUT inválido. Debe ser formato rut";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
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
  if(filters.email_cliente ===""&& filters.rut_cliente===""&&filters.id_sucursal===""&&filters.nombre_cliente===""&&filters.fecha_desde===""&&filters.fecha_hasta===""&&filters.telefono_cliente===""){
    return Swal.fire({
      title: '¡Error!',
      text: "Debes colocar valores para poder filtrar",
      icon: 'error',
      confirmButtonText: 'Aceptar',
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
    } catch (err) {
      setError("Error al obtener los datos de clientes.");
    } finally {
      setLoading(false);
    }
  };
  // Función para generar el archivo Excel
  const exportarExcel = () => {
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
  };

  const abrirModalEdicion = (cliente) => {
    setClienteSeleccionado(cliente); // Establece el cliente a editar
    console.log(cliente);
    setMostrarModal(true); // Muestra el modal
  };
  const EliminarCliente = async (cliente) => {
    /* setClienteEliminar(cliente); */
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/clients/${cliente.rut_cliente}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar token en el header
          },
        }
      );
      if (response.status === 200) {
        setClientes(clientes.filter((c) => c.rut_cliente!== cliente.rut_cliente));
        setClienteEliminar(null);
        
      }
    
      Swal.fire({
        title: '¡Éxito!',
        text: `${response.data.message}`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {}
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
    try {
      /*  const response = await axios.delete() */
    } catch (error) {}
  };

  return (
    <>
      <Navbar />
      <div className="clientes-filtrados-container">
        <div className="rowContainer">
          <div>
            <h1>Filtrar Clientes</h1>
            <form className="filter-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="id_sucursal">Sucursal</label>
                <input
                  type="text"
                  id="id_sucursal"
                  name="id_sucursal"
                  value={filters.id_sucursal}
                  onChange={handleChange}
                  placeholder="Sucursal"
                />
                {errores.id_sucursal && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errores.id_sucursal}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="nombre_cliente">Nombre</label>
                <input
                  type="text"
                  id="nombre_cliente"
                  name="nombre_cliente"
                  value={filters.nombre_cliente}
                  onChange={handleChange}
                  placeholder="Nombre del cliente"
                />
                {errores.nombre_cliente && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errores.nombre_cliente}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="rut_cliente">RUT</label>
                <input
                  type="text"
                  id="rut_cliente"
                  name="rut_cliente"
                  value={filters.rut_cliente}
                  onChange={handleChange}
                  placeholder="RUT del cliente"
                />
                {errores.rut_cliente && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errores.rut_cliente}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="telefono_cliente">Teléfono Cliente</label>
                <input
                  type="text"
                  id="telefono_cliente"
                  name="telefono_cliente"
                  value={filters.telefono_cliente}
                  onChange={handleChange}
                  placeholder="Teléfono del cliente"
                />
                {errores.telefono_cliente && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errores.telefono_cliente}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email_cliente">Email</label>
                <input
                  type="text"
                  id="email_cliente"
                  name="email_cliente"
                  placeholder="ejemplo.123@gmail.com"
                  value={filters.email_cliente}
                  onChange={handleChange}
                />
                {errores.email_cliente && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errores.email_cliente}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="fecha_desde">Fecha Desde</label>
                <input
                  type="date"
                  id="fecha_desde"
                  name="fecha_desde"
                  value={filters.fecha_desde}
                  onChange={handleChange}
                />

                {errores.rango_fechas && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errores.rango_fechas}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="fecha_hasta">Fecha Hasta</label>
                <input
                  type="date"
                  id="fecha_hasta"
                  name="fecha_hasta"
                  value={filters.fecha_hasta}
                  onChange={handleChange}
                />

                {errores.rango_fechas && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errores.rango_fechas}
                  </span>
                )}
              </div>

              <button style={{backgroundColor:"#333"}} type="submit" className="btn-submit">
                Buscar Cliente
              </button>
            </form>
            <button className="rojo " onClick={() => limpiarfiltros()}>
              Limpiar Filtros
            </button>
          </div>
          <div>
            <FormularioCliente />
          </div>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="clientes-grid">
  {clientes.length > 0 ? (
    <div className="contenedor_botones">
      <button className="rojo botton" onClick={() => limpiarGrilla()}>
        Limpiar grilla
      </button>
      <button className="Naranja botton" onClick={exportarExcel}>
        Generar Planilla
      </button>
    </div>
  ) : (
    ""
  )}
  {clientes.length > 0 ? (
    <div style={{ height: "500px", overflowY: "auto", marginBottom: "30px", width:"100%",  display:"flex", justifyContent:"center"/* flexDirection:"column", justifyContent:"center",alignItems:"center" */ }}>
      <table id="table-height" style={{ width: "90%" }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#333",position: "sticky", top: 0, zIndex: 1  }}>Sucursal</th>
            <th style={{ backgroundColor: "#333",position: "sticky", top: 0, zIndex: 1 }}>Nombre</th>
            <th style={{ backgroundColor: "#333",position: "sticky", top: 0, zIndex: 1 }}>Email</th>
            <th style={{ backgroundColor: "#333",position: "sticky", top: 0, zIndex: 1 }}>Teléfono</th>
            <th style={{ backgroundColor: "#333",position: "sticky", top: 0, zIndex: 1 }}>RUT</th>
            <th style={{ backgroundColor: "#333",position: "sticky", top: 0, zIndex: 1 }}>Fecha Registro</th>
            <th style={{ backgroundColor: "#333",position: "sticky", top: 0, zIndex: 1 }}>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr  key={cliente.rut_cliente}>
              <td>{cliente.id_sucursal}</td>
              <td>{cliente.nombre_cliente}</td>
              <td>{cliente.email_cliente}</td>
              <td>{cliente.telefono_cliente}</td>
              <td>{cliente.rut_cliente}</td>
              <td>
                {new Date(cliente.fecha_registro).toISOString().split("T")[0]}
              </td>
              <td style={{display:"flex",justifyContent:"center", alignItems:"center", height:"100%"}}>
                <button
                  className="boton-eliminar"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No se encontraron resultados</p>
  )}
</div>

      {/* Modal para editar cliente */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cerrarModal}>
              &times;
            </span>
            <h4 style={{margin:"5px", textAlign:"center"}}>Actualizar Cliente</h4>
            <form>
              <div className="form-group">
                <label htmlFor="nombre_cliente">Nombre</label>
                <input
                  type="text"
                  id="nombre_cliente"
                  name="nombre_cliente"
                  value={clienteSeleccionado.nombre_cliente}
                  onChange={manejarEdicion}
                />
                {errorEditar.nombre_cliente && (
                  <span
                    style={{ color: "red", fontSize: "12px" }}
                    className="error"
                  >
                    {errorEditar.nombre_cliente}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email_cliente">Email</label>
                <input
                  type="email"
                  id="email_cliente"
                  name="email_cliente"
                  value={clienteSeleccionado.email_cliente}
                  onChange={manejarEdicion}
                />
                {errorEditar.email_cliente && (
                  <span
                    style={{ color: "red", fontSize: "12px" }}
                    className="error"
                  >
                    {errorEditar.email_cliente}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="telefono_cliente">Teléfono</label>
                <input
                  type="text"
                  id="telefono_cliente"
                  name="telefono_cliente"
                  value={clienteSeleccionado.telefono_cliente}
                  onChange={manejarEdicion}
                />
                {errorEditar.telefono_cliente && (
                  <span
                    style={{ color: "red", fontSize: "12px" }}
                    className="error"
                  >
                    {errorEditar.telefono_cliente}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="rut_cliente">RUT</label>
                <input
                  type="text"
                  id="rut_cliente"
                  name="rut_cliente"
                  value={clienteSeleccionado.rut_cliente}
                  onChange={manejarEdicion}
                />
                {errorEditar.rut_cliente && (
                  <span
                    style={{ color: "red", fontSize: "12px" }}
                    className="error"
                  >
                    {errorEditar.rut_cliente}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="id_sucursal">Sucursal</label>
                <input
                  type="text"
                  id="id_sucursal"
                  name="id_sucursal"
                  value={clienteSeleccionado.id_sucursal}
                  onChange={manejarEdicion}
                />
                {errorEditar.id_sucursal && (
                  <span
                    style={{ color: "red", fontSize: "12px" }}
                    className="error"
                  >
                    {errorEditar.id_sucursal}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="btn-guardar"
                onClick={guardarCliente}
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientesFiltrados;
