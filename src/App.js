//import logo from './logo.svg';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import {Amplify, Auth} from "aws-amplify";
import awsExports from "./aws-exports";

import './App.css';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import '@aws-amplify/ui-react/styles.css';
//import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Validate from './pages/auth/Validate';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AddProducts from './pages/AddProduct';
import Navbar from './components/NavBar/Navbar';
import Products from './pages/Products';
import OrdersSeller from './pages/OrdersSeller';
import OrdersBuyer from './pages/OrdersBuyer';

import AuthContextProvider from './contexts/AuthContext';
import WithSnackbar from './components/SnackBar/WithSnackBar'

Amplify.configure(awsExports);

function App(props) {
  return (

    <div>
      <AuthContextProvider >
          <Navbar/>
          <Routes>
            <Route path='*' element={<Home addCustomSnack={props.addCustomSnack}/>} />
            <Route path='/' exact={true} element={<Home addCustomSnack={props.addCustomSnack}/>} />
            <Route path='/login' element={<Login addCustomSnack={props.addCustomSnack}/>} />
            <Route path='/register' element={<Register />} />
            <Route path='/validate' element={<Validate addCustomSnack={props.addCustomSnack}/>} />
            <Route path='/ordersSeller' element={<OrdersSeller addCustomSnack={props.addCustomSnack}/>} />
            <Route path='/ordersBuyer' element={<OrdersBuyer  addCustomSnack={props.addCustomSnack}/>} />
            <Route path='/cart' element={<Cart addCustomSnack={props.addCustomSnack}/>} />
            <Route path='/profile' element={<Profile addCustomSnack={props.addCustomSnack}/>} />
            <Route path='/addProduct' element={<AddProducts addCustomSnack={props.addCustomSnack}/>} />
            <Route path='/products' element={<Products addCustomSnack={props.addCustomSnack}/>} />
          </Routes>
          {/*<SiteFooter />*/}
      </AuthContextProvider>
    </div>
  )
};


export default WithSnackbar(App);
