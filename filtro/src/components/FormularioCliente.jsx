import React, { useState } from 'react';
import axios from 'axios';
import "./login.css"
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router';
import Navbar from './Navbar';

const FormularioCliente = () => {
  const [cliente, setCliente] = useState({
    id_sucursal: '',
    nombre_cliente: '',
    email_cliente: '',
    telefono_cliente: '',
    rut_cliente: '',
  });
  const navigate=useNavigate()
  const [errores, setErrores] = useState({});
  const[errorMensaje,setErrorMensaje]= useState("")
  
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
    const regex = /^[0-9]{7,8}-[0-9]{1}$/
;
    return regex.test(rut.trim());
  };
 
  
  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (
      cliente.id_sucursal.trim().length === 0 || 
      cliente.nombre_cliente.trim().length === 0 || 
      cliente.email_cliente.trim().length === 0 || 
      cliente.telefono_cliente.trim().length === 0 || 
      cliente.rut_cliente.trim().length === 0
    ) {
      return Swal.fire({
        title: "¡Error!",
        text: "Todos los campos son obligatorios",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    
    
    
    if (!validarSucursal(cliente.id_sucursal)) {
      return Swal.fire({
        title: "¡Error!",
        text:'Sucursal inválido. Solo tipo número',
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    
    }
    if(!validarNombre(cliente.nombre_cliente)){
      return Swal.fire({
        title: "¡Error!",
        text:'Nombre inválido. Solo tipo texto',
        icon: "error",
        confirmButtonText: "Aceptar",
      });
   
    }
  
    
    if (!validarEmail(cliente.email_cliente)) {
      return Swal.fire({
        title: "¡Error!",
        text:'Email inválido. Debe ser formato email',
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      
    }
    if (!validarTelefono(cliente.telefono_cliente)) {
      return Swal.fire({
        title: "¡Error!",
        text:'Teléfono inválido. Debe tener 9 dígitos',
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    
    }
    if (!validarRut(cliente.rut_cliente)) {
      return Swal.fire({
        title: "¡Error!",
        text:'RUT inválido. Debe ser formato rut',
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      
    }

   
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
    
  };

  return (
    <>
    <Navbar/>
   
          <div className="modal-content-crear-cliente" style={{
            width: "40%",
            height:"65vh",
            margin: "0 auto",
            padding: "20px",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
            backgroundColor: "#f2f2f2",
            marginTop: "50px",
            marginBottom: "50px",
          }}>
          
        <h2 style={{ textAlign:"center"}}>Registrar nuevo cliente</h2>
           
            <form onSubmit={handleSubmit} className="form-cliente" style={{display:"flex", justifyContent:"center"}}>
  <table className="form-table" style={{}}>
    <tbody>
      <tr>
        <td>
          <label htmlFor="id_sucursal">Sucursal:</label>
        </td>
        <td>
          <select
            id="id_sucursal"
            name="id_sucursal"
            value={cliente.id_sucursal}
            onChange={handleChange}
            placeholder="Selecciona una sucursal"
          >
            <option disabled value="">
              Selecciona una sucursal
            </option>
            <option value="1">Sucursal 1</option>
            <option value="2">Sucursal 2</option>
            <option value="3">Sucursal 3</option>
          </select>
        
        </td>
      </tr>

      <tr>
        <td>
          <label htmlFor="nombre_cliente">Nombre del Cliente:</label>
        </td>
        <td>
          <input
            type="text"
            name="nombre_cliente"
            value={cliente.nombre_cliente}
            onChange={handleChange}
            placeholder="Nombre y Apellido"
          />
        
        </td>
      </tr>

      <tr>
        <td>
          <label htmlFor="email_cliente">Email:</label>
        </td>
        <td>
          <input
            type="text"
            name="email_cliente"
            value={cliente.email_cliente}
            onChange={handleChange}
            placeholder="ejemplo@gmail.com"
          />
         
        </td>
      </tr>

      <tr>
        <td>
          <label htmlFor="telefono_cliente">Teléfono:</label>
        </td>
        <td>
          <input
            type="text"
            name="telefono_cliente"
            value={cliente.telefono_cliente}
            onChange={handleChange}
            placeholder="+56912345678"
          />
        {/*   {errores.telefono_cliente && (
            <span className="error">{errores.telefono_cliente}</span>
          )} */}
        </td>
      </tr>

      <tr>
        <td>
          <label htmlFor="rut_cliente">RUT del Cliente:</label>
        </td>
        <td>
          <input
            type="text"
            name="rut_cliente"
            value={cliente.rut_cliente}
            onChange={handleChange}
            placeholder="67654326-7"
          />
          {/* {errores.rut_cliente && (
            <span className="error">{errores.rut_cliente}</span>
          )} */}
        </td>
      </tr>

      <tr>
        <td colSpan="2" className="button-row">
          <button type="submit"  style={{ backgroundColor: "#15616D", marginTop: "10px" }} className="btn-crear azul">
            Crear Cliente
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

export default FormularioCliente;
