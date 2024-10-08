import React, { useState } from "react";
import axios from "axios";
import "./ClientesFiltrados.css"; // Estilos externos
import FormularioCliente from "./FormularioCliente";

const ClientesFiltrados = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Almacena el cliente seleccionado para editar
  const [mostrarModal, setMostrarModal] = useState(false);

  const [filters, setFilters] = useState({
    id_sucursal: "",
    nombre_cliente: "",
    email_cliente: "",
    telefono_cliente: "",
    fecha_desde: "",
    fecha_hasta: "",
    rut_cliente: "",
  });

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

    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/clients/filtro",
        {
          params: filters,
        }
      );
      setClientes(data.detail);
      console.log(data.detail);
    } catch (err) {
      setError("Error al obtener los datos de clientes.");
    } finally {
      setLoading(false);
    }
  };
  const abrirModalEdicion = (cliente) => {
    setClienteSeleccionado(cliente); // Establece el cliente a editar
    console.log(cliente);
    setMostrarModal(true); // Muestra el modal
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
    try {
      // Realiza la petición PUT al backend con los datos del cliente seleccionado
      const response = await axios.put(
        `http://localhost:3000/api/clients/${clienteSeleccionado.rut_cliente}`,
        clienteSeleccionado
      );

      // Si la respuesta es exitosa, actualiza la lista de clientes
      if (response.status === 200) {
        const nuevosClientes = clientes.map((cliente) =>
          cliente.rut_cliente === clienteSeleccionado.rut_cliente
            ? clienteSeleccionado
            : cliente
        );
        setClientes(nuevosClientes);
        cerrarModal(); // Cierra el modal después de guardar los cambios
        alert("Registro actualizado correctamente.");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setError("Hubo un problema al guardar los cambios.");
    }
  };

  return (
    <>
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
              </div>
              <div className="form-group">
                <label htmlFor="telefono_cliente">Telefono Cliente</label>
                <input
                  type="text"
                  id="telefono_cliente"
                  name="telefono_cliente"
                  value={filters.telefono_cliente}
                  onChange={handleChange}
                  placeholder="Telenofo del clienete"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fecha_hasta">Email</label>
                <input
                  type="text"
                  id="email_cliente"
                  name="email_cliente"
                  value={filters.email_cliente}
                  onChange={handleChange}
                />
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
              </div>

              <button type="submit" className="btn-submit">
                Buscar
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
          <button className="rojo botton" onClick={() => limpiarGrilla()}>
            Limpiar grilla
          </button>
        ) : (
          ""
        )}
        {clientes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Sucursal</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>RUT</th>
                <th>Fecha Registro</th>
                <th>Opcion</th>
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
                    {
                      new Date(cliente.fecha_registro)
                        .toISOString()
                        .split("T")[0]
                    }
                  </td>

                  <td>
                    <button className="amarillo" onClick={() => abrirModalEdicion(cliente)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <h2>Editar Cliente</h2>
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
