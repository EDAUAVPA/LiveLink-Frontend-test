import React, { Component } from 'react';
import Find from './find-route-01.png';
import Look from './look-details-01.png';
import History from './history-01.png';
import './main.css';

class Main extends Component {
  render() {
    return (
        <div className='container-fluid'>
            <section>
                <div className='row mt-4'>
                    <div className='col-12'>
                        <h1 className='text-center'>Bienvenido a GPS Route Tracker</h1>
                    </div>
                </div>
                <div className='row mt-4 px-5'>
                    <div className='col-12 col-md-6 d-flex justify-content-center'>
                        <img src={Find} className='img-fluid look' alt='Find'/>
                    </div>
                    <div className='col-12 col-md-6 content'>
                        <h3>Encuentra tu mejor Ruta...</h3>
                        <p>Con GPS Route Tracker podrás encontrar la mejor ruta para llegar a tu destino.</p>
                    </div>
                </div>
                <div className='row mt-4 px-5 special'>
                    <div className='col-12 col-md-6 ps-md-5 content'>
                        <h3>Podrás guardar tus viajes y tenerlos organizados...</h3>
                        <p>Podrás guardar tus rutas recorridas y buscarlas en cualquier momento que necesites. Todas las rutas estarán organizadas por la fecha en la que se guardaron.</p>
                    </div>
                    <div className='col-12 col-md-6 d-flex justify-content-center'>
                        <img src={History} className='img-fluid look' alt='Find'/>
                    </div>
                    
                </div>
                <div className='row mt-4 px-5'>
                    <div className='col-12 col-md-6 d-flex justify-content-center'>
                        <img src={Look} className='img-fluid look' alt='Look'/>
                    </div>
                    <div className='col-12 col-md-6 content'>
                        <h3>Accede a tus Rutas en el momento que desees...</h3>
                        <p>Podrás ver todos tus viajes realizados y tener un historial de tus rutas recorridas.</p>
                    </div>
                </div>
                <div className='row mt-4 px-5 margin-bottom-custom'>
                    <div className='d-flex justify-content-center'>
                        <a href='/register' className='btn btn-dark'>Registrate Ahora!</a>
                    </div>
                    
                </div>
            </section>
        </div>
    );
  }
}

export default Main;