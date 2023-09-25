//import logo from './logo.svg';
import '../App.css';
import { Amplify, API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import {Storage} from 'aws-amplify';
import { Link } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Snackbar from '../components/SnackBar/SnackBar';

import ModalProduct from '../components/ModalProduct';

import { useAuthContext } from '../contexts/AuthContext';

const productsAPI = "productsapi"
const productspath = '/product'; 

const cartsAPI = "cartsapi"
const cartspath = '/cart'; 

const Home = (props) => {
  const { username, isBuyer } = useAuthContext();

  const [nonLoadedProducts, setNonLoadedProductsProducts] = useState([])
  const [products, setProducts] = useState([])
  const [currentProductName , setCurrentProductName] = useState('')
  const [currentProductSeller, setCurrentProductSeller] = useState('')

  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    API.get(productsAPI, productspath, {}).then((prodRes => {
      setNonLoadedProductsProducts(prodRes); 
      getCompleteItems()
    }));
  }, [refresh]);

  const getCompleteItems = async () => {
    const prods = await Promise.all(
      nonLoadedProducts.map( async prod =>{
        const image = await Storage.get(prod.imagePath)
        prod.imagePath = image
        return prod
      })
    )
    setProducts(prods)

    if(!refresh)
      setRefresh(!refresh)
  }

  const handleClose = () => setShow(false);

  const handleShow = (prodName, sellerUser) => {
    const currentProd = (products.find(obj => {
      return (obj.productName === prodName && obj.sellerUsername === sellerUser);
    }));
    setCurrentProductName(currentProd.productName);
    setCurrentProductSeller(currentProd.sellerUsername);
    setShow(true);
  }

  const handleAdd = (fromModal) => {
    setShow(false);
    if(fromModal.qnty > 0){
      const tmstmp = Date.now();
      console.log(fromModal.name);
      console.log(fromModal.qnty);
      console.log(tmstmp);
      console.log(fromModal.seller);
      API.put(cartsAPI, cartspath, {
        body: {
          buyerUsername: username,
          addedTimestamp: tmstmp,
          sellerUsername: fromModal.seller,
          productName: fromModal.name,
          quantity: fromModal.qnty
        }
      }).then(result => {
        const msg = "Product " + fromModal.name + " added to cart"
        props.addCustomSnack(<Snackbar variant="success" message={msg} />, {
          horizontal: "top",
          vertical: "right"
        })
      }).catch(err => {
        props.addCustomSnack(<Snackbar variant="error" message={err.message} />, {
          horizontal: "top",
          vertical: "right"
        })
      })
      
    }
  }

  return (
    <Container className='container-style'>
    <h1 className='text-color'>Products</h1>
    <div className="row row-cols-4 row-cols-md-6 g-6 mt-6 mb-6 gap-3">
    {
        products.map((prod, index)=> {
          return (
            <>
            <Col md>
              <Card className='ProductMainCard' key={index}>
                <Card.Img variant="top" src={prod.imagePath} className='ProductListImg'/>
                <Card.Body>
                  <Card.Title className='text-color'>{prod.productName}</Card.Title>
                  <Card.Text className='text-color'>
                    Price(€): {prod.price}<br>
                    </br>
                    Available quantity: {prod.availableQuantity}
                  </Card.Text>
                  {
                    (function(){
                      if(isBuyer === "true"){
                        return <Button variant="outline-primary" onClick={() => handleShow(prod.productName, prod.sellerUsername)}>
                          Add to cart
                        </Button>
                      }
                    })()
                  }
                  </Card.Body>
                </Card>
              </Col>
              <div>
              {/* BsIcons.BsFillCartPlusFill*/}
              <ModalProduct 
                show = {show}
                name = {currentProductName}
                seller = {currentProductSeller}
                onClick={handleAdd}
                onHide={handleClose}
                />
              </div>
            </>
            )
          }
        )
      }
      </div>
    
  </Container >
    
    
  )
}

export default Home;