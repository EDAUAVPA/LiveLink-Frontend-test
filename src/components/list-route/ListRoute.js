import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './listRoute.css';
import Imagen from './imagen.jpg';


export default function ListRoute () {
  const [routes, setRoutes] = useState([]);

  let user_id;

  if (localStorage.getItem('gps-token')){
    getUserId(localStorage.getItem('gps-token'));
  } else {
    Swal.fire({
        icon: 'error',
        text: 'Usario inválido'
    })
    window.location = '/login';
  }

  /**
   * Gets user ID by passing a token
   * @param {*} token 
   */
  async function getUserId(token){
    const resp = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/info`, {headers: {
        token: token
    }});

    user_id = resp.data;
    
    getUserTracks(user_id);
  }

  /**
   * Gets all the routes that belong to the user
   * @param {*} userId 
   */
  async function getUserTracks(userId){
    let data = {
      user_id: userId
    }

    await axios.post(`${process.env.REACT_APP_LOCAL}/api/trackRecord`, data, {
      headers: { token: localStorage.getItem('gps-token') }
    }).then(res => {
      if(routes.length === 0){
        setRoutes((newRoutes) => {
          newRoutes = [];
  
          if (!res.data.message){
            for (let data of res.data){
                data.record_date = data.record_date.slice(0, data.record_date.lastIndexOf('T'));
                newRoutes.push(data)
            }
          } else {
            newRoutes.push(res.data);
          }
          return newRoutes;
        })
      }
    })

    //console.log(routes);
  }


  return (
        <div className='container-fluid'>
          <div className='row mt-2'>
            <div className='col-12'>
              <a href={'/user-profile'} className='d-flex align-items-center link'><span className="material-icons me-1">
              arrow_back_ios</span>Volver</a>
            </div>
          </div>
          <div className='row mt-4'>
            <div className='col-12'>
              <h2 className='text-center'>Listado de Rutas</h2>
            </div>
          </div>
          <div className='row mt-4 margin-bottom-custom'>
            <div className='col-12'>
              {routes.length > 0 && routes[0].message && <p className='text-center message'><em>{routes[0].message}</em></p>}
              <div className='row'>
              {routes.length > 0 && !routes[0].message && routes.map((route) => (
                <div className='col-12 col-md-6 col-lg-4 mb-3' key={route.track_record_id}>
                    <div className="card" >
                    <img src={Imagen} className="card-img-top" alt="..."/>
                    <div className="card-body">
                      <h4 className="card-title title">Ruta Registrada #{route.track_record_id}</h4>
                      <p className="card-text"><span className='header me-1'>Partida:</span> {route.origin}</p>
                      <p><span className='header me-1'>Destino:</span> {route.destination}</p>
                      <p><span className='header me-1'>Fecha:</span> {route.record_date}</p>
                      <div className='d-flex justify-content-center'>
                        <a href={`/details/${route.track_record_id}`} className="btn btn-dark d-flex align-items-center">
                          Ver detalles <span className="material-icons ms-2">
                        remove_red_eye</span></a>
                      </div>
                      
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
          
        </div>
  );
  
}

