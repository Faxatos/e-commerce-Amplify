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

function OrdersSeller(props) {
  const { username, isBuyer, isAuthenticated, accessToken, setBalance } = useAuthContext();

  const [orders, setOrders] = useState([])

  const navigate = useNavigate();

  const getGSIParams = {
    queryStringParameters:{
      useGSI: "true", 
      GSIpartitionKey: "sellerUsername", 
      GSIname: "ordersSeller"
    }
  }

  useEffect(() => {
    if(isAuthenticated === false){
      navigate('/')
    }
  
    if(isBuyer === "true"){ 
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
        const updatedObj = {
          ...obj,
          status: newStatus
        };
        return updatedObj;
      }

      return obj;
    });
    
    setOrders(newState);
  };

  const cancelOrder = async (orderId) => {

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
        status: "cancelled",
        sellerUsername: currentOrder.sellerUsername,
        productName: currentOrder.productName,
        quantity: currentOrder.quantity,
        totalAmmount: currentOrder.totalAmmount
      }
    })
    const msg = "Order " + orderId + " cancelled"
    props.addCustomSnack(<Snackbar variant="success" message={msg} />, {
        horizontal: "top",
        vertical: "right"
    })
    updateOrderState(orderId, "mustBeRefunded");
  }

  const confirmOrder = async (orderId) => {

    const currentOrder = (orders.find(obj => {
      return (obj.orderId === orderId)
    }));

    try {
      await API.put(ordersAPI, orderspath, {
        queryStringParameters:{
          requireBalance: "false"
        },
        body:{
          buyerUsername: currentOrder.buyerUsername,
          orderTimestamp: currentOrder.orderTimestamp,
          orderId: currentOrder.orderId,
          status: "drafted",
          sellerUsername: currentOrder.sellerUsername,
          productName: currentOrder.productName,
          quantity: currentOrder.quantity,
          totalAmmount: currentOrder.totalAmmount
        }
      })
      const msg = "Order " + orderId + " confirmed"
      props.addCustomSnack(<Snackbar variant="success" message={msg} />, {
          horizontal: "top",
          vertical: "right"
      })
      updateOrderState(orderId, "confirmed");
    } catch (error) {
      let msg;
      if(error.message === "Request failed with status code 471"){
        msg = "Insufficient products " + currentOrder.productName + " available in your inventory."
      }
      else{
        msg = error.message
      }
      props.addCustomSnack(<Snackbar variant="error" message={msg} />, {
        horizontal: "top",
        vertical: "right"
      })
    }
  }

  const claimOrder = async (orderId) => {

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
        status: "delivered",
        sellerUsername: currentOrder.sellerUsername,
        productName: currentOrder.productName,
        quantity: currentOrder.quantity,
        totalAmmount: currentOrder.totalAmmount
      }
    }).then((res => {
      const msg = "Payment of order " + orderId + " claimed"
        props.addCustomSnack(<Snackbar variant="success" message={msg} />, {
            horizontal: "top",
            vertical: "right"
      })
      setBalance(res.success)
    }))

    updateOrderState(orderId, "claimed");
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
                  <p>id: {item.orderId} - product: {item.productName} - quantity: {item.quantity} - status: {item.status} - date: {new Intl.DateTimeFormat('en-EU', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(item.orderTimestamp)}</p>
                  {
                    (function(){
                      if(item.status === "drafted"){
                        return <>
                          <Button variant="outline-danger" onClick={(e) => {disableButton(e);cancelOrder(item.orderId)}}>
                            Cancel Order
                          </Button> 
                          <Button variant="outline-light" onClick={(e) => {disableButton(e);confirmOrder(item.orderId)}}>
                            Confirm Order
                          </Button> 
                        </>
                      }
                      else if(item.status === "delivered"){
                        return <Button variant="outline-success" onClick={(e) => {disableButton(e);claimOrder(item.orderId)}}>
                            Claim Payment
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
  
export default OrdersSeller;