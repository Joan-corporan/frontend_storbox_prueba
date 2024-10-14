import React, { useState } from 'react';
import axios from 'axios';
import "./login.css"
import Swal from 'sweetalert2'; 

const FormularioCliente = () => {
  const [cliente, setCliente] = useState({
    id_sucursal: '',
    nombre_cliente: '',
    email_cliente: '',
    telefono_cliente: '',
    rut_cliente: '',
  });

  const [errores, setErrores] = useState({});
  const[errorMensaje,setErrorMensaje]= useState("")
  
/* const {mostrarAlerta}= SweetAlert() */
  // Funciones de validación
  const validarNombre = (nombre) => {
    const regex = /^[a-zA-ZñáéíóúÁÉÍÓ��\s]+$/;
    return regex.test(nombre);
  };
const validarSucursal=(sucursal)=>{
  const regex=/^[0-9]+$/;
  return regex.test(sucursal)
}
  const validarEmail = (email) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validarTelefono = (telefono) => {
    const regex = /^(\+56)?9[0-9]{8}$/; 
    return regex.test(telefono);
  };

  const validarRut = (rut) => {
    const regex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
    return regex.test(rut.trim().toUpperCase());
  };
  

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const nuevoErrores = {};
    if (!validarSucursal(cliente.id_sucursal)) {
      nuevoErrores.id_sucursal = 'Sucursal inválido. Solo tipo número';
    }
    if(!validarNombre(cliente.nombre_cliente)){
      nuevoErrores.nombre_cliente = 'Nombre inválido. Solo tipo texto';
    }
  
    
    if (!validarEmail(cliente.email_cliente)) {
      nuevoErrores.email_cliente = 'Email inválido. Debe ser formato email';
    }
    if (!validarTelefono(cliente.telefono_cliente)) {
      nuevoErrores.telefono_cliente = 'Teléfono inválido. Debe tener 9 dígitos';
    }
    if (!validarRut(cliente.rut_cliente)) {
      nuevoErrores.rut_cliente = 'RUT inválido. Debe ser formato rut';
    }

    if (Object.keys(nuevoErrores).length > 0) {
      setErrores(nuevoErrores);
      console.log(nuevoErrores)
      console.log(errores.id_sucursal)
    } else {
      setErrores({});
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('http://localhost:3000/api/clients/create',cliente,  {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        });
       
        Swal.fire({
          title: '¡Éxito!',
          text: `${response.data.message}`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        console.log(response.data)
       
        setCliente({
          id_sucursal: '',
          nombre_cliente: '',
          email_cliente: '',
          telefono_cliente: '',
          rut_cliente: '',
        });
        setErrorMensaje("")
      } catch (error) {
        console.error('Error al crear el cliente', error);
        if(error.response){
          setErrorMensaje(error.response.data.message)
          Swal.fire({
            title: 'Error',
            text: `${errorMensaje}`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
    
      }
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="form-cliente">
      <h2>Crear nuevo cliente</h2>

      <div className="form-group">
        <label>Sucursal</label>
        <input
          type="text"
          name="id_sucursal"
          value={cliente.id_sucursal}
          onChange={handleChange}
          placeholder='Ejemplo: 1234'
          
        />
        {errores.id_sucursal && <span style={{ color: 'red', fontSize:"12px" }}>{errores.id_sucursal}</span>}

      </div>

      <div className="form-group">
        <label>Nombre del Cliente</label>
        <input
          type="text"
          name="nombre_cliente"
          value={cliente.nombre_cliente}
          onChange={handleChange}
          placeholder='Nombre y Apellido'
          
        />
        {errores.nombre_cliente && <span style={{ color: 'red', fontSize:"12px" }}>{errores.nombre_cliente}</span>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="text"
          name="email_cliente"
          value={cliente.email_cliente}
          onChange={handleChange}
          placeholder='ejemplo@gmail.com'
          
        />
        {errores.email_cliente && <span style={{ color: 'red', fontSize:"12px" }}>{errores.email_cliente}</span>}
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="text"
          name="telefono_cliente"
          value={cliente.telefono_cliente}
          onChange={handleChange}
          placeholder='+56912345678'
          
        />
        {errores.telefono_cliente && <span style={{ color: 'red', fontSize:"12px" }}>{errores.telefono_cliente}</span>}
      </div>

      <div className="form-group">
        <label>RUT del Cliente</label>
        <input
          type="text"
          name="rut_cliente"
          value={cliente.rut_cliente}
          onChange={handleChange}
          placeholder='67654326-7'
          
        />
        {errores.rut_cliente && <span style={{ color: 'red', fontSize:"12px"}}>{errores.rut_cliente}</span>}
      </div>

      <button  type="submit" className="btn-crear azul">Crear Cliente</button>
    </form>  
    
    </>
  );
};

export default FormularioCliente;
