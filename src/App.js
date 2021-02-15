import React, { useState }  from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import SearchRoute from "./components/search-route/SearchRoute";
import ListRoute from "./components/list-route/ListRoute";
import RouteDetails from "./components/route-details/RouteDetails";
import UserLogin from "./components/user-login/UserLogin";
import UserRegister from "./components/user-register/UserRegister";
import RecordTrack from "./components/record-track/RecordTrack";
import Main from "./components/main/Main";
import UserView from "./components/user-view/UserView";
import Logo from "../src/logo.png";


function App() {
  const [name, setName] = useState('');

    let user_id;

    if (localStorage.getItem('gps-token')){
        getUserId(localStorage.getItem('gps-token'));
    }

    async function getUserId(token){
        const resp = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/info`, {headers: {
            token: token
        }});

        user_id = resp.data;
       
        getName(user_id);
    }

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

    const closeSession = (event) => {
      localStorage.removeItem('gps-token');
      //window.location = '/';
    }

  return (
    <BrowserRouter>
    <div className="container-fluid">
      <section className="row">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src={Logo} alt="logo" height="45"/>
              </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                {name === '' && 
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Registrate</Link>
                  </li>
                </ul>
                }
                {name !== '' && 
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link className="nav-link d-flex align-items-center" to="/user-profile"><span className="material-icons me-2">
                      account_circle</span>{name}</Link>
                    </li>
                    <li className="nav-item">
                      <a className='nav-link' href='/' onClick={closeSession}>Cerrar Sesión</a>
                    </li>
                </ul>
                }
               
              
            </div>
            
          </div>
        </nav>
      </section>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/search">
            <SearchRoute />
          </Route>
          <Route path="/list">
            <ListRoute />
          </Route>
          <Route path="/details/:track_record_id">
            <RouteDetails />
          </Route>
          <Route path="/login">
            <UserLogin />
          </Route>
          <Route path="/register">
            <UserRegister />
          </Route>
          <Route path="/record-track">
            <RecordTrack />
          </Route>
          <Route path="/user-profile">
            <UserView />
          </Route>
          
        </Switch>
      
    </div>
    <footer className='bg-dark'>
      <p className='footer-text'>GPS Route Tracker By Eduardo Avalos - 2021</p>
    </footer>
    </BrowserRouter>
    
  );
}

export default App;
