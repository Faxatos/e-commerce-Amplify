import '../App.css';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import { API } from 'aws-amplify';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Snackbar from '../components/SnackBar/SnackBar';

import Button from 'react-bootstrap/Button';

import { useAuthContext } from '../contexts/AuthContext';

const ordersAPI = "ordersapi"
const orderspath = '/order'; 

function OrdersBuyer(props) {
  const { username, isBuyer, isAuthenticated, accessToken, setBalance } = useAuthContext();

  const [orders, setOrders] = useState([])

  const navigate = useNavigate();

  const getGSIParams = {
    queryStringParameters:{
      useGSI: "false"
    }
  }

  useEffect(() => {
    if(isAuthenticated === false){
      navigate('/')
    }
  
    if(isBuyer === "false"){ 
      navigate('/')
    }

    API.get(ordersAPI, orderspath + "/" + username, getGSIParams).then((orderRes => setOrders(orderRes)))
  }, [navigate, isAuthenticated, isBuyer, username]);
  
  const disableButton = (event) => {
    event.currentTarget.disabled = true;
  };

  const updateOrderState = (orderId, newStatus) => {
    const newState = orders.map(obj => {
      if (obj.orderId === orderId) {
        return {...obj, status: newStatus};
      }

      return obj;
    });

    setOrders(newState);
  };

  async function closeOrder (orderId) {

    const currentOrder = (orders.find(obj => {
      return (obj.orderId === orderId)
    }));

    await API.put(ordersAPI, orderspath, {
      queryStringParameters:{
        requireBalance: "false"
      },
      body:{
        buyerUsername: currentOrder.buyerUsername,
        orderTimestamp: currentOrder.orderTimestamp,
        orderId: currentOrder.orderId,
        status: "confirmed",
        sellerUsername: currentOrder.sellerUsername,
        productName: currentOrder.productName,
        quantity: currentOrder.quantity,
        totalAmmount: currentOrder.totalAmmount
      }
    })
    const msg = "Order " + orderId + " delivered"
        props.addCustomSnack(<Snackbar variant="success" message={msg} />, {
            horizontal: "top",
            vertical: "right"
    })
    updateOrderState(orderId, "delivered");
  }

  async function cancelOrder (orderId) {

    const currentOrder = (orders.find(obj => {
      return (obj.orderId === orderId)
    }));

    await API.put(ordersAPI, orderspath, {
      queryStringParameters:{
        accessToken: accessToken,
        requireBalance: "true"
      },
      body:{
        buyerUsername: currentOrder.buyerUsername,
        orderTimestamp: currentOrder.orderTimestamp,
        orderId: currentOrder.orderId,
        status: "mustBeRefunded",
        sellerUsername: currentOrder.sellerUsername,
        productName: currentOrder.productName,
        quantity: currentOrder.quantity,
        totalAmmount: currentOrder.totalAmmount
      }
    }).then(result => {
        setBalance(result.success)
        const msg = "Order " + orderId + " refunded"
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
    updateOrderState(orderId, "refunded");
  }

    return (
      <Container>
        <h1>Your Orders</h1>
        {
          orders.sort((a, b) => b.orderTimestamp - a.orderTimestamp)
          .map((item, index)=> {
            return (
              <>
                <div className="Product" key={index}>
                  <p>product: {item.productName} - quantity: {item.quantity} - status: {item.status} - date: {new Intl.DateTimeFormat('en-EU', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(item.orderTimestamp)}</p>
                  {
                    (function(){
                      switch (item.status) {
                        case "drafted":
                          return <Button variant="outline-danger" onClick={(e) => {disableButton(e);cancelOrder(item.orderId)}}>
                            Cancel order
                          </Button>

                        case "mustBeRefunded":
                          return <Button variant="outline-success" onClick={(e) => {disableButton(e);cancelOrder(item.orderId)}}>
                            Get refunded
                          </Button>

                        case "confirmed":
                          return <Button variant="outline-light" onClick={(e) => {disableButton(e);closeOrder(item.orderId)}}>
                            Confirm delivery
                          </Button>
                      }
                  })()}
                </div>
              </>
              )
            }
          )
        }
      </Container>
    );
  }
  
  export default OrdersBuyer;
