import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import { API } from 'aws-amplify';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import Button from 'react-bootstrap/Button';

const cartsAPI = "cartsapi"
const cartspath = '/cart'; 

const ordersAPI = "ordersapi"
const orderspath = '/order'; 

function Cart(props) {
  const [cart, setCart] = useState([]);
  const [tmpCart, setTmpCart] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if(props.isAuthenticated === false){
      navigate('/')
    }
  
    if(props.isBuyer === "false"){ 
      navigate('/')
    }
    
    console.log(props.accessToken)
    API.get(cartsAPI, cartspath + "/" + props.username, {}).then((prodRes => setCart(prodRes)))
  }, [navigate, props.isAuthenticated, props.isBuyer, props.username]);

  function createOrder() {

    cart.forEach(async (item) => {
      try {
        await API.post(ordersAPI, orderspath, {
          queryStringParameters:{
          accessToken: props.accessToken
        },
        body:{
          buyerUsername: item.buyerUsername,
          status: "drafted",
          sellerUsername: item.sellerUsername,
          productName: item.productName,
          quantity: item.quantity,
        }
      }).then((res => {console.log(res);props.updateBalance(res.success)}))
      setTmpCart(tmpCart.concat(item))
      console.log(tmpCart)
      } catch (error) {
        if(error.message === "Request failed with status code 401"){
          console.log("Insufficient items on sale.");
        }
        if(error.message === "Request failed with status code 403"){
          console.log("Insufficient balance.");
        }
      }

    });

    console.log(tmpCart)
    setCart(tmpCart)
    setTmpCart([]);
  }

  const deleteFromCart = (prodName, username) => {
    setCart((oldValues) =>
      oldValues.filter((item) => (item.buyerUsername !== username && item.productName !== prodName))
    );

    API.del(cartsAPI, cartspath + "/object/" + username  + "/" + prodName, {}).
      then(result => {
        console.log(result);
      }).catch(err => {
        console.log(err);
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
              <Button variant="primary" onClick={() => deleteFromCart(item.productName, item.buyerUsername)}>
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