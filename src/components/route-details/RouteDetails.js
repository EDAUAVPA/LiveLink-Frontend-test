import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './routeDetails.css';
import * as turf from '@turf/turf';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps";

export default function ListRoute() {
  const [route, setRoute] = useState({
    track_record_id: 0,
    origin: '',
    origin_coord: '',
    destination: '',
    destination_coord: '',
    route: '',
    record_date: '',
    user_id: 0,
    center: ''
  });

  const { track_record_id } = useParams();

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
    
    getTrackData(track_record_id, user_id);
  }

  /**
   * Gets the info of the route
   * @param {*} trackId 
   * @param {*} userId 
   */
  async function getTrackData(trackId, userId){
    let data = {
      track_record_id: trackId,
      user_id: userId
    }

    const result = await axios.post(`${process.env.REACT_APP_LOCAL}/api/trackRecord/detailed-record`, data, {
      headers: { token: localStorage.getItem('gps-token') }
    })

    if (result.data.message){
      Swal.fire({
        icon: 'warning',
        text: `${result.data.message}. Redirigiendo`,
      });
      
      window.location = '/user-profile';
     
    }

    if (route.origin === ''){
      setRoute((newRoute) => {
        newRoute = result.data[0];

        newRoute.record_date = newRoute.record_date.slice(0, newRoute.record_date.lastIndexOf('T'));

        newRoute.origin_coord = JSON.parse(newRoute.origin_coord);
        newRoute.destination_coord = JSON.parse(newRoute.destination_coord);
        newRoute.route = JSON.parse(newRoute.route);

        newRoute.center = getCenter(newRoute);

        return newRoute;
      });
    }
    
    //console.log(route);
  }
  /**
   * Calculates the center of the start and end point fo the route
   * @param {*} data 
   */
  function getCenter(data){
    let point1 = turf.point([data.origin_coord.lng, data.origin_coord.lat]);
    let point2 = turf.point([data.destination_coord.lng, data.destination_coord.lat]);

    let midpoint = turf.midpoint(point1, point2);
    
    return {lat: midpoint.geometry.coordinates[1], lng: midpoint.geometry.coordinates[0]};
  }

  /**
   * Set the bounds of the map in base of the origin and destination coordinates
   * @param {*} map 
   */
  const fitBounds = map => {
    let myPlaces = [];
    myPlaces.push(route.origin_coord);
    myPlaces.push(route.destination_coord);
  
    if (route.origin_coord !== ''){
      const bounds = new window.google.maps.LatLngBounds();

      myPlaces.map(place => {
        bounds.extend(place);
        return place;
      });

      if (map !== null){
        map.fitBounds(bounds);
      }
    }
    
  };
  

  const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
      defaultZoom={12}
      defaultCenter={route.center}
      ref={fitBounds}
    >
      <Marker icon={{
        url: 'https://gist.githubusercontent.com/EDAUAVPA/de49703f4fbe021d1636e84ad2ba9ebe/raw/ee01183cf77322d9dddb57382840f85024701e89/start-gps.svg',
        scaledSize: {
          height: 70,
          width: 70
        }}} 
        position={route.origin_coord} />
      <Marker icon={{
        url: 'https://gist.githubusercontent.com/EDAUAVPA/7786587610ecd1f956b011625327a6fc/raw/41ee15fad4e37950868b91e78d962500e18c61b5/finish-gps.svg',
        scaledSize: {
          height: 70,
          width: 70
        }}}
      position={route.destination_coord} />
      <Polyline path={route.route}
        options={{
          strokeColor: "#000000",
          strokeOpacity: 0.75,
          strokeWeight: 2
      }}
      />
    </GoogleMap>
  ));

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
              <h2 className='text-center'>Detalle de la Ruta</h2>
            </div>
          </div>
          <div className='row mt-4'>
            <div className='col-12 d-flex justify-content-center'>
              <div>
                <p className='data'><span className="material-icons me-2">
                logout</span><span className='me-1'>Origen:</span>{route.origin}</p>
                <p className='data'><span className="material-icons me-2">
                login</span><span className='me-1'>Destino:</span>{route.destination}</p>
                <p className='data justify-content-center'><span className="material-icons me-2">
                event</span><span className='me-1'>Fecha:</span> {route.record_date}</p>
              </div>
            </div>
          </div>
          <div className='row mt-4 margin-bottom-custom'>
          <MyMapComponent
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA4Fn-fPdOsPyWrYTZLgOoY1CaiSO1qIpQ"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `500px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
          </div>
        </div>
  );
  
}