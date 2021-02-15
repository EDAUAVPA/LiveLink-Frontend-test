import React from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Swal from 'sweetalert2';


require('dotenv').config();

export default function UserLogin() {
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = data => {
        //console.log(data);
        validateUser(data);
    };

    /**
     * Validates user data and returns a token
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

    //console.log(watch("email"));

        return (
            <div className='container-fluid'>
                <div className='row my-4'>
                    <div className='col-12'>
                        <h2 className='text-center'>Iniciar Sesión</h2>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-1 col-md-4'></div>
                    <div className='col-10 col-md-4'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label className="form-label header">Email:</label>
                                <input type="email" className={`form-control ${errors.email ? 'border-danger' : ''}`} name='email' ref={register({ required: true, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} placeholder='Ingrese su email'/>
                                {errors.email && errors.email.type === 'required' && <em><small className='text-danger'>* Este campo es requerido</small></em>}
                                {errors.email && errors.email.type === 'pattern' && <em><small className='text-danger'>* El email debe tener un formato: name@email.com</small></em>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label header">Contraseña:</label>
                                <input type="password" className={`form-control ${errors.pass ? 'border-danger' : ''}`}  name='pass' ref={register({ required: true, minLength: 8 })} placeholder='Ingrese su Contraseña'/>
                                {errors.pass && errors.pass.type === 'required' && <em><small className='text-danger'>* Este campo es requerido</small></em>}
                                {errors.pass && errors.pass.type === 'minLength' && <em><small className='text-danger'>* Debe tener como mínimo 8 caracteres</small></em>}
                            </div>
                            <div className='d-flex justify-content-center'>
                                <button type="submit" className="btn btn-dark d-flex align-items-center" >
                                    Log In <span className="material-icons ms-2">login</span></button>
                            </div>
                            
                        </form>
                    </div>
                    <div className='col-1 col-md-4'></div>
                </div>
            
            </div>
        );
}




