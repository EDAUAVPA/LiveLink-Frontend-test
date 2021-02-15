import React, { useState }  from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './userView.css'
import List from './list-01.png';
import Search from './search-01.png';
import Register from './register-01.png';

export default function UserView() {
    const [name, setName] = useState('');

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
     * Gets user ID from token
     * @param {*} token 
     */
    async function getUserId(token){
        const resp = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/info`, {headers: {
            token: token
        }});

        user_id = resp.data;
        //console.log(user_id)
        getName(user_id);
    }

    /**
     * Finds the name of the user by passing his ID to the server
     * @param {*} userId 
     */
    async function getName(userId) {
        await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/name/${userId}`, {headers: {
            token: localStorage.getItem('gps-token')
        }}).then(res => {
            
            if (name === ''){
                setName((newName) => {
                    newName = res.data[0].full_name
                    return newName;
                })
            }
        })
    }

    return (
        <div className='container-fluid'>
            <div className='row mt-4'>
                <div className='col-12 px-5'>
                    <h1 className='text-center'>Hola {name}!</h1>
                    <h4 className='text-center my-5'>Desde aquí podras acceder a las diferentes servicios de la aplicación.</h4>
                    <div className="card mb-5 bg-transparent" >
                        <div className="row g-0">
                            <div className="col-md-6">
                                <img className='img-fluid' src={Register} alt="Register"/>
                            </div>
                            <div className="col-md-6">
                                <div className="card-body">
                                    <h5 className="card-title">Registrar Rutas</h5>
                                    <p className="card-text">Aquí podras buscar los puntos de origen y destino de tus recorridos, encontrar la mejor ruta y guardarla en tu perfil para tener un historial de tus viajes.</p>
                                    <div className='d-flex'>
                                        <a href={'/record-track'} className='btn btn-dark d-flex align-items-center'>
                                        Acceder al Servicio<span className="material-icons ms-2">check_circle_outline</span></a>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-5 bg-transparent" >
                        <div className="row g-0 special">
                            <div className="col-md-6">
                                <div className="card-body">
                                    <h5 className="card-title">Buscar Rutas Guardadas</h5>
                                    <p className="card-text">Al registrar tus rutas, puedes buscarlas por fecha y acceder a sus características.</p>
                                    <div className='d-flex'>
                                        <a href={'/search'} className='btn btn-dark d-flex align-items-center'>
                                        Acceder al Servicio<span className="material-icons ms-2">check_circle_outline</span></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <img className='img-fluid' src={Search} alt="Search"/>
                            </div>
                        </div>
                    </div>
                    <div className="card margin-bottom-custom bg-transparent">
                        <div className="row g-0">
                            <div className="col-md-6">
                                <img className='img-fluid' src={List} alt="List"/>
                            </div>
                            <div className="col-md-6">
                                <div className="card-body">
                                    <h5 className="card-title">Listado de Rutas</h5>
                                    <p className="card-text">Aquí se muestran todas las rutas de tus viajes guardados en tu sesión, puedes ver el origen, destino y la fecha en la que se realizaron.</p>
                                    <div className='d-flex'>
                                        <a href={'/list'} className='btn btn-dark d-flex align-items-center'>
                                        Acceder al Servicio<span className="material-icons ms-2">check_circle_outline</span></a>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  
}