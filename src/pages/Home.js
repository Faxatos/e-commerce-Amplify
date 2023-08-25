//import logo from './logo.svg';
import '../App.css';
import { Amplify, API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import ModalProduct from '../components/ModalProduct';

const productsAPI = "productsapi"
const productspath = '/product'; 

const cartsAPI = "cartsapi"
const cartspath = '/cart'; 

const Home = (props) => {

  const [products, setProducts] = useState([])
  const [currentProductName , setCurrentProductName] = useState('')
  const [currentProductSeller, setCurrentProductSeller] = useState('')

  const [show, setShow] = useState(false);

  useEffect(() => {
    API.get(productsAPI, productspath, {}).then((prodRes => setProducts(prodRes)))
  }, []);

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
          buyerUsername: props.username,
          addedTimestamp: tmstmp,
          sellerUsername: fromModal.seller,
          productName: fromModal.name,
          quantity: fromModal.qnty
        }
      }).then(result => {
          console.log(result);
      }).catch(err => {
          console.log(err);
      })
      
    }
  }

  return (
    
    <Container>

      <div className="ProductsWrapper">
        <h1>Products</h1>
        {
          products.map((prod)=> {
            return (
              <>
              <div className="Product" key={uuidv4()}>
                <p>{prod.productName}</p>
                <div>
                {
                  (function(){
                    if(props.isBuyer === "true"){
                      return <Button key={uuidv4()} variant="primary" onClick={() => handleShow(prod.productName, prod.sellerUsername)}>
                        Add to cart
                      </Button>
                    }
                  })()
                }
                  {/* BsIcons.BsFillCartPlusFill*/}
                  
                  <ModalProduct 
                    show = {show}
                    name = {currentProductName}
                    seller = {currentProductSeller}
                    onClick={handleAdd}
                    onHide={handleClose}
                  />
                </div>
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