import React from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Swal from 'sweetalert2';
import './userRegister.css';

export default function UserRegister() {
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = data => {
        //console.log(data);
        registerUser(data);
    };

    /**
     * Stores user data on DB and makes a login after it
     * @param {*} data 
     */
    async function registerUser(data){
        //console.log(data);
        await axios.post(`${process.env.REACT_APP_LOCAL}/api/user/create`, data).then(
            res => {
                //console.log(res.data)
                Swal.fire({
                    icon: 'success',
                    text: res.data.message
                })

                validateUser(data);                
            }
        );
    }

    /**
     * Validates user info and returns a token
     * @param {*} data 
     */
    async function validateUser(data){
        await axios.post(`${process.env.REACT_APP_LOCAL}/api/user/login`, data).then(
            res => {
                if (res.data.token){
                    localStorage.setItem('gps-token', res.data.token);
                    window.location = '/user-profile';
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: res.data.message
                    })
                }
                
            }
        );
    }

    return (
        <div className='container-fluid'>
            <div className='row mt-4 '>
                <div className='col-12 mb-5'>
                    <h2 className='text-center'>Registrar Usuario</h2>
                </div>
                <div className='col-1 col-md-4'></div>
                <div className='col-10 col-md-4'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label header">Nombre Completo:</label>
                            <input type="text" className={`form-control ${errors.full_name ? 'border-danger' : ''}`} name='full_name' ref={register({ required: true })} placeholder='Escriba su nombre completo' />
                            {errors.full_name && errors.full_name.type === 'required' && <em><small className='text-danger'>* Este campo es requerido</small></em>}
                        </div>
                        <div className="mb-3">
                            <label  className="form-label header">Email:</label>
                            <input type="email" className={`form-control ${errors.email ? 'border-danger' : ''}`} name='email' ref={register({ required: true, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} placeholder='Ingrese su email' />
                            {errors.email && errors.email.type === 'required' && <em><small className='text-danger'>* Este campo es requerido</small></em>}
                            {errors.email && errors.email.type === 'pattern' && <em><small className='text-danger'>* El email debe tener un formato: name@email.com</small></em>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label header">Contraseña:</label>
                            <input type="password" className={`form-control ${errors.pass ? 'border-danger' : ''}`}  name='pass' ref={register({ required: true, minLength: 8 })} placeholder='Ingrese su contraseña'/>
                            {errors.pass && errors.pass.type === 'required' && <em><small className='text-danger'>* Este campo es requerido</small></em>}
                            {errors.pass && errors.pass.type === 'minLength' && <em><small className='text-danger'>* Debe tener como mínimo 8 caracteres</small></em>}
                        </div>
                        <div className='mt-5 d-flex justify-content-center'>
                            <button type="submit" className="btn btn-dark d-flex align-items-center">
                            <span className="material-icons me-2">person_add_alt_1</span>Registrar Usuario</button>
                        </div>
                        
                    </form>
                </div>
                <div className='col-1 col-md-4'></div>
            </div>
          
        </div>
    );
  
}