import '../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Amplify from 'aws-amplify'
import { API } from 'aws-amplify';
import {Storage} from 'aws-amplify';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Snackbar from '../components/SnackBar/SnackBar';

import { useAuthContext } from '../contexts/AuthContext';

const productsAPI = "productsapi"
const productspath = '/product'; 

function AddProducts(props) {
    const navigate = useNavigate();

    const { isAuthenticated, username } = useAuthContext();

    const [image, setImage] = useState({});
    const [category, setCategory] = useState('');
    const [prodName, setProdName] = useState('');
    const [size, setSize] = useState('');
    const [weight, setWeight] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState('');
    const [avQuantity, setAvQuantity] = useState('');

    useEffect(() => {
        console.log(isAuthenticated)
        if(isAuthenticated === false){
            navigate('/')
        }
    }, [navigate, isAuthenticated]);

    const handleNewFile = e => {
        const file = e.target.files[0]
        setImage({
            fileUrl: URL.createObjectURL(file),
            file,
            filename: file.name
        })
    }

    const handleNewProduct = () => {
        try {
            console.log(prodName);
            console.log(category);
            console.log(size);
            console.log(weight);
            console.log(color);
            console.log(price);
            console.log(avQuantity);

            console.log(username)

            Storage.put(image.filename, image.file)
                .then(result => {
                    const msg = "Product " + prodName + " created"
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
                
            API.post(productsAPI, productspath, {
                body: {
                    productName: prodName,
                    category: category,
                    sellerUsername: username,
                    price: price,
                    availableQuantity: avQuantity,
                    imagePath: image.filename,
                    size: size,
                    weight: weight,
                    color: color,
                }
            }).then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            })
            
            navigate('/products')
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

            <Form.Group as={Row} className="mb-3" controlId="formPlainFile">
                <Form.Label column sm="2">
                    Image:
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="file" placeholder="Select an Image"
                            onChange={(e) => handleNewFile(e)} />
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