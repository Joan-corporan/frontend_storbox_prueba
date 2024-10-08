import React, { useState } from 'react';
import axios from 'axios';

const FormularioCliente = () => {
  const [cliente, setCliente] = useState({
    id_sucursal: '',
    nombre_cliente: '',
    email_cliente: '',
    telefono_cliente: '',
    rut_cliente: '',
  });

  const handleChange = (e) => {
    console.log(cliente)
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const response = await axios.post('http://localhost:3000/api/clients/create', cliente);
      alert('Cliente creado con éxito');
      setCliente({
        id_sucursal: '',
        nombre_cliente: '',
        email_cliente: '',
        telefono_cliente: '',
        rut_cliente: '',
      });
    } catch (error) {
      console.error('Error al crear el cliente', error);
      alert('Ocurrió un error al crear el cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-cliente">
      <h2>Crear nuevo cliente</h2>
      <div className="form-group">
        <label>Sucursal</label>
        <input
          type="number"
          name="id_sucursal"
          value={cliente.id_sucursal}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Nombre del Cliente</label>
        <input
          type="text"
          name="nombre_cliente"
          value={cliente.nombre_cliente}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email_cliente"
          value={cliente.email_cliente}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="text"
          name="telefono_cliente"
          value={cliente.telefono_cliente}
          onChange={handleChange}
          required
        />
      </div>
     
      <div className="form-group">
        <label>RUT del Cliente</label>
        <input
          type="text"
          name="rut_cliente"
          value={cliente.rut_cliente}
          onChange={handleChange}
          required
        />
      </div>
      <button  type="submit" className="btn-crear azul">
        Crear Cliente
      </button>
    </form>
  );
};

export default FormularioCliente;
