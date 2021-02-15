import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Swal from 'sweetalert2';
import './searchRoute.css';


let user_id;

export default function SearchRoute() {
    const [routes, setRoutes] = useState([]);
    
    if (localStorage.getItem('gps-token')){
        getUserId(localStorage.getItem('gps-token'));
    } else {
        Swal.fire({
            icon: 'error',
            text: 'Usario inválido'
        })
        window.location = '/login';
    }

    const { register, handleSubmit, watch, errors } = useForm();

    const onSubmit = data => {
        //console.log(data);
        searchRoutes(data);
    };

    /**
     * Searchs all the routes that are between the dates specified and that are from the same User ID
     * @param {*} data 
     */
    async function searchRoutes(data){
        //console.log(user_id);
        await axios.post(`${process.env.REACT_APP_LOCAL}/api/trackRecord/search/${user_id}`, data).then(
            res => {
                setRoutes((prevRoutes) => {
                    prevRoutes = [];
                
                    if (!res.data.message){
                        for (let data of res.data){
                            data.record_date = data.record_date.slice(0, data.record_date.lastIndexOf('T'));
                            prevRoutes.push(data)
                        }
                    } else {
                        prevRoutes.push(res.data);
                    }
                    return prevRoutes;
                });
                console.log(routes);
            }
        )
    }
    
    /**
     * Gets user ID from the token
     * @param {*} token 
     */
    async function getUserId(token){
        const resp = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/info`, {headers: {
            token: token
        }});
    
        user_id = resp.data;
    }
 
    return (
        <div className="container-fluid">
            <div className='row mt-2'>
            <div className='col-12'>
              <a href={'/user-profile'} className='d-flex align-items-center link'><span className="material-icons me-1">
              arrow_back_ios</span>Volver</a>
            </div>
          </div>
            <div className='row mt-5'>
                <div className='col-12' >
                    <h2 className='text-center'>Buscador de Rutas</h2>
                </div>
            </div>

            <div className='row my-4'>
                <div className='col-1 col-lg-3'></div>
                <div className='col-10 col-lg-6'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label">Seleccionar fecha de inicio:</label>
                            <input type="date" max={watch('end_date')} name='start_date' className="form-control" placeholder='Ingrese la fecha de inicio' ref={register({ required: true})} />
                            {errors.start_date && <em><small className='text-danger'>* Este campo es requerido</small></em>}
                        </div>
                        <div className="mb-5">
                            <label className="form-label">Seleccionar fecha final:</label>
                            <input type="date" min={watch('start_date')} name='end_date' className="form-control" placeholder='Ingrese la fecha de fin' ref={register({ required: true})} />
                            {errors.end_date && <em><small className='text-danger'>* Este campo es requerido</small></em>}
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type="submit" className="btn btn-dark d-flex align-items-center"><span className="material-icons me-2">
                            search</span>Ver Rutas</button>
                        </div>
                        
                    </form>
                </div>
                <div className='col-1 col-lg-3'></div>
            </div>
            <div className='row mt-2 margin-bottom-custom'>
                <div className='col-1 col-lg-4'></div>
                <div className='col-10 col-lg-4'>
                {routes.length > 0 && !routes[0].message && routes.map((route) => (
                    <a className='route-card row' key={route.track_record_id} href={`/details/${route.track_record_id}`}>
                        <div className='col-6'>
                            <p><strong>Desde:</strong> {route.origin}</p>
                            <p><strong>Hasta:</strong> {route.destination}</p>
                        </div>
                        <div className='col-6'>
                            <p className='d-flex align-items-center justify-content-end'>Ver detalles de Ruta 
                            <span className="material-icons ms-2">
                            timeline</span></p>
                            <p className='text-end'><strong>Fecha:</strong> {route.record_date}</p>
                        </div>
                    </a>)
                )}
                {routes.length > 0 && routes[0].message && <p className='message'>{routes[0].message}</p>}
                </div>
                <div className='col-1 col-lg-4'></div>
            </div>
        </div>
    );
  
}



