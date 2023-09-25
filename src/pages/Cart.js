import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import { API } from 'aws-amplify';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Snackbar from '../components/SnackBar/SnackBar';

import { v4 as uuidv4 } from 'uuid';

import Button from 'react-bootstrap/Button';

import { useAuthContext } from '../contexts/AuthContext';

const cartsAPI = "cartsapi"
const cartspath = '/cart'; 

const ordersAPI = "ordersapi"
const orderspath = '/order'; 

function Cart(props) {
  const { isAuthenticated, isBuyer, username, accessToken, setBalance } = useAuthContext();

  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated === false){
      navigate('/')
    }
  
    if(isBuyer === "false"){ 
      navigate('/')
    }
    
    console.log(accessToken)
    API.get(cartsAPI, cartspath + "/" + username, {}).then((prodRes => setCart(prodRes)))
  }, [navigate, isAuthenticated, isBuyer, username]);

  async function createOrder() {

    for (const item of cart) {
      try {
      const res = await API.post(ordersAPI, orderspath, {
          queryStringParameters:{
          accessToken: accessToken
        },
        body:{
          buyerUsername: item.buyerUsername,
          sellerUsername: item.sellerUsername,
          productName: item.productName,
          quantity: item.quantity,
        }
      });
      setBalance(res.success)
      const msg = "Order containing " + item.productName + " created"
          props.addCustomSnack(<Snackbar variant="success" message={msg} />, {
              horizontal: "top",
              vertical: "right"
      })
      } 
      catch (error) {
        let msg;
        if(error.message === "Request failed with status code 471"){
          msg = "Insufficient products " + item.productName + " on sale"
        }
        else if(error.message === "Request failed with status code 473"){
          msg = "Insufficient balance"
        }
        else{
          msg = error.message
        }
        props.addCustomSnack(<Snackbar variant="error" message={msg} />, {
          horizontal: "bottom",
          vertical: "right"
        })
      }
    }

    API.get(cartsAPI, cartspath + "/" + username, {}).then((prodRes => setCart(prodRes)))
  }

  const deleteFromCart = (prodName, username) => {
    setCart((current) =>
      current.filter((item) => {return item.buyerUsername !== username && item.productName !== prodName})
    );

    API.del(cartsAPI, cartspath + "/object/" + username  + "/" + prodName, {})
      .then(result => {
          const msg = "Product " + prodName + " removed from cart"
              props.addCustomSnack(<Snackbar variant="success" message={msg} />, {
                  horizontal: "top",
                  vertical: "right"
          })
      })
      .catch(err => {
          props.addCustomSnack(<Snackbar variant="error" message={err.message} />, {
              horizontal: "top",
              vertical: "right"
          })
      })
  }

  return (
      <Container>
      
      <h1>Your Cart</h1>
      {
        cart.map((item, index)=> {
          return (
            <div className="Product" key={index}>
              <p>{item.productName} - quantity: {item.quantity}</p>
              <Button variant="primary" onClick={() => deleteFromCart(item.productName, item.sellerUsername)}>
                      Delete
              </Button>
            </div>)
          }
        )
      }
      <Button onClick={() => createOrder()}> Create Order </Button>
     </Container>
  );
  }
  
  export default Cart;