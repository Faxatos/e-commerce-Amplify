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

Amplify.configure(awsExports);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isBuyer, setIsBuyer] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [balance, setBalance] = useState(0);

  function updateAuthStatus(authStatus) {
    setIsAuthenticated(authStatus)

    if(authStatus === true){
      getUserInfo();
    }
    else{ //logout branch - reset current user fields
      setAccessToken('');
      setUsername('');
      setIsBuyer('');
      setFullname('');
      setAddress('');
      setDescription('');
      setEmail('');
      setBalance(0);
    }
  }

  function updateBalance(newBalance) {
    setBalance(newBalance);
  }

  async function getUserInfo() {
    await Auth.currentAuthenticatedUser()
    .then((user) => {
      setAccessToken(user.signInUserSession.accessToken.jwtToken);
      setUsername(user.username);
      setIsBuyer(user.attributes['custom:isBuyer']);
      setFullname(user.attributes['name']);
      setAddress(user.attributes['address']);
      setDescription(user.attributes['custom:description']);
      setEmail(user.attributes['email']);
      setBalance(user.attributes['custom:balance']);
    })
    .catch(error => console.log(`Error: ${error.message}`));
  }

  return (

    <div>
      <Navbar 
        isAuthenticated={isAuthenticated} 
        updateAuthStatus={updateAuthStatus}
        isBuyer = {isBuyer}
      />
      <Routes>
        <Route path='*' element={<Home 
                                  isAuthenticated={isAuthenticated}
                                  username = {username}
                                  isBuyer = {isBuyer}
                                />} />
        <Route path='/' exact={true} element={<Home 
                                  isAuthenticated={isAuthenticated}
                                  username = {username}
                                  isBuyer = {isBuyer}
                                />} />
        <Route path='/login' element={<Login updateAuthStatus={updateAuthStatus} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/validate' element={<Validate />} />
        <Route path='/ordersSeller' element={<OrdersSeller
                                          isAuthenticated={isAuthenticated} 
                                          accessToken = {accessToken}
                                          isBuyer = {isBuyer}
                                          username = {username}
                                          updateBalance={updateBalance} />} />
        <Route path='/ordersBuyer' element={<OrdersBuyer 
                                          isAuthenticated={isAuthenticated} 
                                          accessToken = {accessToken}
                                          isBuyer = {isBuyer}
                                          username = {username}
                                          updateBalance={updateBalance} />} />
        <Route path='/cart' element={<Cart 
                                        isAuthenticated={isAuthenticated}
                                        accessToken = {accessToken}
                                        username = {username}
                                        isBuyer = {isBuyer}
                                        updateBalance={updateBalance}
                                       />} />
        <Route path='/profile' element={<Profile 
                                          isAuthenticated={isAuthenticated} 
                                          isBuyer = {isBuyer}
                                          username = {username}
                                          email = {email}
                                          fullname = {fullname}
                                          address = {address}
                                          description = {description}
                                          balance = {balance}
                                          updateBalance={updateBalance}
                                        />} />
        <Route path='/addProduct' element={<AddProducts 
                                            isAuthenticated={isAuthenticated}
                                            username = {username}
                                            isBuyer = {isBuyer}
                                          />} />
        <Route path='/products' element={<Products 
                                            isAuthenticated={isAuthenticated}
                                            username = {username}
                                            isBuyer = {isBuyer}
                                           />} />
      </Routes>
      {/*<SiteFooter />*/}
    </div>
  )
};


export default App;
