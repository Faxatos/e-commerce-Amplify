import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import { API } from 'aws-amplify';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Snackbar from '../components/SnackBar/SnackBar';

import { useAuthContext } from '../contexts/AuthContext';

const productsAPI = "productsapi"
const productspath = '/product'; 

function Products(props) {
    const { username, isBuyer, isAuthenticated } = useAuthContext();
    const [products, setProducts] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
      if(isAuthenticated === false){
        navigate('/')
      }

      if(isBuyer === "true"){
        navigate('/')
      }

      console.log(username)
      console.log(productspath + "/" + username)
      API.get(productsAPI, productspath + "/" + username, {}).then((prodRes => setProducts(prodRes)))
    }, [navigate, isAuthenticated, isBuyer, username]);

    const handleNewQuantity = (event) => {
      event.preventDefault();

      const currentProd = (products.find(obj => {
        return (obj.productName === event.target.productName.value && obj.sellerUsername === event.target.sellerUsername.value)
      }));
      API.put(productsAPI, productspath, {
        body: {
            productName: currentProd.productName,
            category: currentProd.category,
            sellerUsername: currentProd.sellerUsername,
            price: currentProd.price,
            availableQuantity: event.target.newAvailableQuantity.value,
            imagePath: currentProd.imagePath,
            size: currentProd.size,
            weight: currentProd.weight,
            color: currentProd.color,
        }
    }).then(result => {
      const msg = "Product " + currentProd.productName + " available quantity modified"
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
        <h1>Your products</h1>
        {
          products.map((prod, index)=> {
            return (
              <div className="Product" key={index}>
                <p>{prod.productName}</p>
                <div>
                  <Form onSubmit={handleNewQuantity}>
                    <Row>
                      <Col sm="12">
                        <Form.Label>
                          Available quantity:
                        </Form.Label>

                        <input type="number" defaultValue={prod.availableQuantity} id="newAvailableQuantity" name="newAvailableQuantity"/>
                        <input type="hidden" defaultValue={prod.productName} id="productName" name="productName"/>
                        <input type="hidden" defaultValue={prod.sellerUsername} id="sellerUsername" name="sellerUsername"/>   

                        <Button variant="primary" type="submit">
                              Modify quantity
                        </Button> 
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>)
            }
          )
        }
        <Link to='/addProduct'> Add product </Link>
      </Container>
    );
  }
  
  export default Products;