
import React from 'react'
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker, DirectionsRenderer } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import * as turf from '@turf/turf';
import axios from 'axios';
import Swal from 'sweetalert2';
import './map2.css';

const google = window.google = window.google ? window.google : {}


Geocode.enableDebug();

class Map2 extends React.Component{
    allowSave = false;

    routeCoords = [];

    state = {
        address1: '',
        address2: '',
        directions: null,
        displayDirections: false,
        mapPosition: {
            lat: this.props.center.lat,
            lng: this.props.center.lng
        },
        markerPosition: {
            lat: this.props.center.lat,
            lng: this.props.center.lng
        },
        markerPosition2: {
            lat: this.props.center.lat,
            lng: this.props.center.lng
        },
        isOpen1: false,
        isOpen2: false,
    }

    /**
     * Calculates the center of two points
     */
    calculateCenterOfMap(coord1, coord2){
        if (coord1.lat !== this.props.center.lat && coord2.lat !== this.props.center.lat){
            let features = turf.featureCollection([
                turf.point( [coord1.lng, coord1.lat]),
                turf.point( [coord2.lng, coord2.lat])
              ]);
              
            let center = turf.center(features);
            
            this.setState({
                mapPosition: {
                    lat: center.geometry.coordinates[1],
                    lng: center.geometry.coordinates[0]
                }
            });
        } else if (coord1.lat !== this.props.center.lat && coord2.lat === this.props.center.lat){
            this.setState({
                mapPosition: {
                    lat: coord1.lat,
                    lng: coord1.lng
                }
            });
        } else if (coord1.lat === this.props.center.lat && coord2.lat !== this.props.center.lat){
            this.setState({
                mapPosition: {
                    lat: coord2.lat,
                    lng: coord2.lng
                }
            });
        }

    }

    /**
     * Get the current address from the default map position and set those values in the state
     */
    componentDidMount() {
        Geocode.fromLatLng(this.state.markerPosition.lat, this.state.markerPosition.lng, process.env.REACT_APP_GOOGLE_KEY, 'es').then(
        response => {
            const address = response.results[0].formatted_address,
            addressArray =  response.results[0].address_components;
        
            this.setState( {
            address1: ( address ) ? address : ''
            } )

            document.querySelector('#address1').value = this.state.address1;
        },
        error => {
            console.error(error);
        }
    );

    Geocode.fromLatLng( this.state.markerPosition2.lat, this.state.markerPosition2.lng, process.env.REACT_APP_GOOGLE_KEY, 'es' ).then(
        response2 => {
            const address = response2.results[0].formatted_address,
            addressArray =  response2.results[0].address_components;
        
            this.setState( {
                address2: ( address ) ? address : ''
            })
            document.querySelector('#address2').value = this.state.address2;
        },
        error => {
            console.error(error);
        });

    };

    /**
     * Gets the direction points from Google Direction Service
     * @param {*} e 
     */
    getDirections = (e) => {
        const directionsService = new google.maps.DirectionsService();
        this.displayDirections = true;
        this.allowSave = true;
        if (this.displayDirections){
            directionsService.route(
                {
                  origin: this.state.markerPosition,
                  destination: this.state.markerPosition2,
                  travelMode: google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    console.log(result.request.origin.location.lng());
                    console.log(this.state.markerPosition.lng)
                  if (status === google.maps.DirectionsStatus.OK) {
                    this.extractCoordinates(result.routes[0].overview_path);

                    this.setState({
                      directions: result
                    });

                  } else {
                    console.error(`error fetching directions ${result}`);
                  }
                }
            );
        } 
    }

    /**
     * Extracts coordinates from the response array of Google Api
     * @param {Array<Object>} coordinates 
     */
    extractCoordinates(coordinates){
        for (let coord of coordinates){
            let data = {};
            data.lat = coord.lat();
            data.lng = coord.lng();
            this.routeCoords.push(data);
        }
    }

    /**
     * Saves the route data into the database
     */
    saveData = async() => {
        let data = {
            origin: this.state.address1,
            origin_coord: JSON.stringify({lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng}),
            destination: this.state.address2,
            destination_coord: JSON.stringify({lat: this.state.markerPosition2.lat, lng: this.state.markerPosition2.lng}),
            route: JSON.stringify(this.routeCoords)
        }

        let userId = this.props.userId;
        
        if (localStorage.getItem('gps-token')){
            await axios.post(`${process.env.REACT_APP_LOCAL}/api/trackRecord/save/${userId}`, data, {headers: {
                token: localStorage.getItem('gps-token')
            }}).then(
                res => {
                    Swal.fire({
                        icon: 'success',
                        text: res.data.message
                    });
                    setTimeout(() => {
                        window.location= '/user-profile'
                    }, 1500);
                }
            ).catch((error) => {
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
    
    /**
     * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
     *
     * @param nextProps
     * @param nextState
     * @return {boolean}
     */
    shouldComponentUpdate( nextProps, nextState ){
        let res = false;

        if (this.state.directions !== nextState.directions || 
            this.state.markerPosition.lat !== nextState.markerPosition.lat ||
            this.state.markerPosition2.lat !== nextState.markerPosition2.lat){
            res = true
        }
        
        return res;
    }

    /**
     * And function for city,state and address input
     * @param event
     */
    onChange = ( event ) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    /**
     * This Event triggers when the marker window is closed
     *
     * @param event
     */
    onInfoWindowClose = () => {
        this.setState({
            isOpen1: !this.state.isOpen1
        });
    };

    onSecondInfoWindowClose = () => {
        this.setState({
            isOpen2: !this.state.isOpen2
        });
    }

    /**
     * When the user types an address in the search box
     * @param place
     */
    onPlaceSelected = ( place ) => {
        if (!place.name){
            const address = place.formatted_address,
            addressArray =  place.address_components,
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();

            // Set these values in the state.
            this.setState({
                address1: ( address ) ? address : '',
                markerPosition: {
                    lat: latValue,
                    lng: lngValue
                }
            })

            this.calculateCenterOfMap(this.state.markerPosition, this.state.markerPosition2);
        }
    };

    onSecondPlaceSelected = ( place ) => {
        if (!place.name){
            const address = place.formatted_address;
            const addressArray =  place.address_components;
            const latValue = place.geometry.location.lat();
            const lngValue = place.geometry.location.lng();
            let marker = null;

            // Set these values in the state.
            this.setState({
                address2: ( address ) ? address : '',
                markerPosition2: {
                    lat: latValue,
                    lng: lngValue
                }
            })

            this.calculateCenterOfMap(this.state.markerPosition, this.state.markerPosition2);
        }  
    };

    /**
     * When the marker is dragged you get the lat and long using the functions available from event object.
     * Use geocode to get the address, city, area and state from the lat and lng positions.
     * And then set those values in the state.
     *
     * @param event
     */
    onMarkerDragEnd = ( event ) => {
        let newLat = event.latLng.lat(),
        newLng = event.latLng.lng(),
        addressArray = [];

        Geocode.fromLatLng(newLat, newLng, process.env.REACT_APP_GOOGLE_KEY, 'es').then(
            response => {
                const address = response.results[0].formatted_address,
                addressArray =  response.results[0].address_components;

                this.setState({ 
                    address1: ( address ) ? address : '',
                    markerPosition: {
                        lat: newLat,
                        lng: newLng
                    }
                });
                document.querySelector('#address1').value = this.state.address1;
            },
            error => {
                console.error(error);
            }
        );
    };

    onSecondMarkerDragEnd = ( event ) => {
        let newLat = event.latLng.lat(),
        newLng = event.latLng.lng(),
        addressArray = [];

        Geocode.fromLatLng(newLat, newLng, process.env.REACT_APP_GOOGLE_KEY, 'es').then(
            response => {
                const address = response.results[0].formatted_address,
                addressArray =  response.results[0].address_components;

                this.setState({ 
                    address2: ( address ) ? address : '',
                    markerPosition2: {
                        lat: newLat,
                        lng: newLng
                    }
                });

                document.querySelector('#address2').value = this.state.address2;
            },
            error => {
                console.error(error);
            }
        );
    };
 
    render(){
        const {directions} = this.state;

        const fitBounds = map => {
            let myPlaces = [];
            myPlaces.push(this.state.markerPosition);
            myPlaces.push(this.state.markerPosition2);
          
            if (this.state.markerPosition.lat !== ''){
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

        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (
                    <GoogleMap
                     google={this.props.google}
                     ref={fitBounds}
                    defaultZoom={this.props.zoom}
                    defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
                    id='map'
                    >

                        {/* For Auto complete Search Box  marginTop: '2px',
                            marginBottom: '100px' */}
                        <Autocomplete
                        style={{
                            width: '48%',
                            height: '40px',
                            paddingLeft: '16px',
                            position: 'absolute',
                            top: '234px',
                            left: '20px'
                        }}
                        id='origin-search'
                        className='form-control'
                        onPlaceSelected={ this.onPlaceSelected }
                        types={['address']}
                        placeholder='Ingrese la dirección de origen'
                        />

                        <Autocomplete
                        style={{
                            width: '48%',
                            height: '40px',
                            paddingLeft: '16px',
                            position: 'absolute',
                            top: '310px',
                            left: '20px'
                        }}
                        id='destination-search'
                        className='form-control'
                        onPlaceSelected={ this.onSecondPlaceSelected }
                        types={['address']}
                        placeholder='Ingrese la dirección de destino'
                        />

                            <Marker 
                            icon={{
                                url: 'https://gist.githubusercontent.com/EDAUAVPA/de49703f4fbe021d1636e84ad2ba9ebe/raw/ee01183cf77322d9dddb57382840f85024701e89/start-gps.svg',
                                scaledSize: {
                                    height: 70,
                                    width: 70
                                }
                            }}
                            name={'Marcador 1'}
                            draggable={true}
                            onDragEnd={ this.onMarkerDragEnd }
                            position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                            onClick={this.onInfoWindowClose}
                            />

                            {this.state.address1 != '' ? (
                                <InfoWindow
                                onCloseClick={this.onInfoWindowClose}
                                position={{ lat: ( this.state.markerPosition.lat + 0.0018 ), lng: this.state.markerPosition.lng }}
                                >
                                <div>
                                    <h4 className='text-center'>Origen</h4>
                                    <span style={{ padding: 0, margin: 0 }}>{ this.state.address1 }</span>
                                </div>
                                </InfoWindow>
                            ) : ''}
                            
                                
                            <Marker 
                            icon={{
                                url: 'https://gist.githubusercontent.com/EDAUAVPA/7786587610ecd1f956b011625327a6fc/raw/41ee15fad4e37950868b91e78d962500e18c61b5/finish-gps.svg',
                                scaledSize: {
                                    height: 70,
                                    width: 70
                                }
                            
                            }}
                            name={'Marcador 2'}
                            draggable={true}
                            raiseOnDrag={true}
                            onDragEnd={ this.onSecondMarkerDragEnd }
                            position={{ lat: this.state.markerPosition2.lat, lng: this.state.markerPosition2.lng}}
                            onClick={this.onSecondInfoWindowClose}
                            />
  
                        {this.state.address2 != '' ? (
                            <InfoWindow
                            onCloseClick={this.onSecondInfoWindowClose}
                            position={{ lat: ( this.state.markerPosition2.lat + 0.0018 ), lng: this.state.markerPosition2.lng }}
                            >
                            <div>
                                <h4 className='text-center'>Destino</h4>
                                <span style={{ padding: 0, margin: 0 }}>{ this.state.address2 }</span>
                            </div>
                        </InfoWindow>
                        ) : ''}
                        
                        {directions ? <DirectionsRenderer 
                        directions={directions} 
                        options={{
                            polylineOptions: {
                              storkeColor: '#000000',
                              strokeOpacity: 0.4,
                              strokeWeight: 4
                            },
                            suppressMarkers: true
                        }}
                        /> : null}
                        
                    </GoogleMap>
            )
            )
        );

        let map;

        if( this.props.center.lat !== undefined ) {
            map = <div>
                    <div className='row'>
                        <div className='col-12 col-md-6'>
                            <div className='responsive-block'></div>
                        </div>
                        <div className='col-12 col-md-6'>
                            <div className='mb-3'>
                                <div className="form-group mb-3">
                                    <label htmlFor="">Dirección de origen:</label>
                                    <input type="text" name="address" id='address1' className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.address1 }/>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="">Dirección de destino:</label>
                                    <input type="text" name="address" id='address2' className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.address2 }/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <AsyncMap
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA4Fn-fPdOsPyWrYTZLgOoY1CaiSO1qIpQ&libraries=places"
                    loadingElement={
                    <div style={{ height: `100%` }} />
                    }
                    containerElement={
                    <div style={{ height: this.props.height }} />
                    }
                    mapElement={
                    <div style={{ height: `100%` }} />
                    }
                    />

                    <div className='row my-4'>
                        <div className='col-12'>
                            <div className='d-flex justify-content-center'>
                                <button className='btn btn-success d-flex align-items-center' onClick={this.getDirections}>Encontrar ruta
                                <span className="material-icons ms-2">directions</span></button>
                                {this.allowSave ? (
                                    <button className='btn btn-dark d-flex align-items-center ms-4' onClick={this.saveData}>Guardar Ruta
                                    <span class="material-icons ms-2">save_alt</span></button>
                                ) : ''}
                                
                            </div>
                        </div>
                    </div>
                </div>
        } else {
            map = <div style={{height: this.props.height}} />
    }
        return( map )
    }
}

export default Map2;