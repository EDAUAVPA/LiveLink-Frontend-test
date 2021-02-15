import axios from "axios";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Map2 from './Map2.js';
import './recordTrack.css';

class RecordTrack extends Component {
  constructor(){
    super();
    this.state = {
      userId: null
    }
  }

  async componentDidMount(){
    if (localStorage.getItem('gps-token')){
      await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/info`, {headers: {
        'token': localStorage.getItem('gps-token')
      }}).then(
        res => { 
          this.setState({
            userId: res.data
          });
      }).catch((error) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'error',
          text: 'Conexión con el servidor perdida, actualizando...'
        })
        
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      });
    } else {
      window.location = '/login';
    }
  }

  render() {
      return (
        <div className='container-fluid px-0'>
          <div className='row mt-2'>
            <div className='col-12'>
              <a href={'/user-profile'} className='d-flex align-items-center link'><span className="material-icons me-1">
              arrow_back_ios</span>Volver</a>
            </div>
          </div>
          <div className='row my-4'>
            <div className='col-12'>
              <h2 className='text-center'>Registrar Ruta</h2>
            </div>
          </div>
          <div className='map-container'>
          <Map2 google={this.props.google}
            userId={this.state.userId}
            center={{lat: 40.4378698, lng: -3.8196199}}
            height='550px'
            zoom={11}
        /> 
          </div>
        </div>
      );
    
    
  }
}

export default RecordTrack;
