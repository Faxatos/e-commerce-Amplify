import '../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from 'aws-amplify';
//import React, { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const productsAPI = "productsapi"
const productspath = '/product'; 

function AddProducts(props) {
    const navigate = useNavigate();

    const [category, setCategory] = useState('');
    const [prodName, setProdName] = useState('');
    const [size, setSize] = useState('');
    const [weight, setWeight] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState('');
    const [avQuantity, setAvQuantity] = useState('');

    useEffect(() => {
        console.log(props.isAuthenticated)
        if(props.isAuthenticated === false){
            navigate('/')
        }
    }, [navigate, props.isAuthenticated]);

    const handleNewProduct = () => {
        try {
            console.log(prodName);
            console.log(category);
            console.log(size);
            console.log(weight);
            console.log(color);
            console.log(price);
            console.log(avQuantity);

            console.log(props.username)
                
            API.post(productsAPI, productspath, {
                body: {
                    productName: prodName,
                    category: category,
                    sellerUsername: props.username,
                    price: price,
                    availableQuantity: avQuantity,
                    imagePath: "toAdd",
                    size: size,
                    weight: weight,
                    color: color,
                }
            }).then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            })
            
            navigate('/')
        } catch (err) { console.log(err) }
    }

    return (
    <Container>
        <Col className="px-4 my-5">
            <Row><h1>Add product</h1></Row>
            <Form>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextProdName">
                <Form.Label column sm="2">
                    Product name:
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="text" placeholder="Enter Product name"
                            onChange={(e) => setProdName(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextCategory">
                <Form.Label column sm="2">
                    Category:
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="text" placeholder="Enter Category"
                            onChange={(e) => setCategory(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formNumberPrice">
                <Form.Label column sm="2">
                    Price (€):
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="number" placeholder="Enter Price"
                            onChange={(e) => setPrice(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formNumberAvQuantity">
                <Form.Label column sm="2">
                    Available Quantity:
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="number" placeholder="Enter Available Quantity"
                            onChange={(e) => setAvQuantity(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextSize">
                <Form.Label column sm="2">
                    Size:
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="text" placeholder="Enter Size"
                            onChange={(e) => setSize(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formNumberWeight">
                <Form.Label column sm="2">
                    Weight (Kg):
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="number" placeholder="Enter Weight"
                            onChange={(e) => setWeight(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextColor">
                <Form.Label column sm="2">
                    Color:
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="text" placeholder="Enter Color"
                            onChange={(e) => setColor(e.target.value)} />
                </Col>
            </Form.Group>
            </Form>
        </Col>
        <Col>
            <Button variant="primary" type="button"
                            onClick={() => handleNewProduct()}>Add product &gt;&gt;
            </Button>
        </Col>
        </Container>
        )
    }
  
  export default AddProducts;