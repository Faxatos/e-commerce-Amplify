import '../App.css';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import {Auth} from "aws-amplify";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Snackbar from '../components/SnackBar/SnackBar';

import { useAuthContext } from '../contexts/AuthContext';

function Profile(props) {
    const { username, isBuyer, isAuthenticated, balance, setBalance, fullname, address, description, email } = useAuthContext();

    const navigate = useNavigate();
    const [pageBalance, setPageBalance] = useState(0);
    const [toUpdate, setToUpdate] = useState(0);
    const [updateType, setUpdateType] = useState(0);

    useEffect(() => {
      if(isAuthenticated === false){
        navigate('/')
      } 
      setPageBalance(Number(balance))
    }, [navigate, isAuthenticated]);

    async function updateBalance() {
      const user = await Auth.currentAuthenticatedUser();
      var newBal = (Number(updateType) === 0) ? (Number(user.attributes['custom:balance']) + Number(toUpdate)) : (Number(user.attributes['custom:balance']) - toUpdate)
      if(newBal < 0){
        props.addCustomSnack(<Snackbar variant="error" message="Insufficient balance - withdraw denied" />, {
          horizontal: "top",
          vertical: "right"
      })
      }
      else{
        await Auth.updateUserAttributes(user, {
          'custom:balance': newBal.toString()
        });

        setBalance(newBal)
        setPageBalance(newBal)

        props.addCustomSnack(<Snackbar variant="success" message="Balance updated" />, {
          horizontal: "top",
          vertical: "right"
         })
      }
    }

    return (
        < Container >
            <Col className="px-4 my-5">
              {
                (function(){
                  if (isBuyer === "true"){
                    return (<Row><h1>Buyer Profile: {username}</h1></Row>)
                  }
                  else if(isBuyer === "false"){
                    return (<Row><h1>Seller Profile: {username}</h1></Row>)
                  }
                })()
              }
              <Form>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextFullname">
                  <Form.Label column sm="2">
                    Full name:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={fullname} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                  <Form.Label column sm="2">
                    Email:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={email} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextAddress">
                  <Form.Label column sm="2">
                    Address:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={address} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formDescription">
                    <Form.Label column sm="2">
                      Description:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control plaintext rows={3} readOnly defaultValue={description} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formBalance">
                    <Form.Label column sm="2">
                      Balance (€):
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control plaintext rows={3} readOnly value={pageBalance.toFixed(2)} />
                    </Col>
                </Form.Group>
              </Form>

              <div className=".mb-8"></div>

              <Form>
                <Col className="px-4 my-5">
                  <h3>Update balance</h3>
                </Col>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Type of Transaction</Form.Label>
                    <Col sm="4">
                      <Form.Select aria-label="Default select example" onChange={evt => setUpdateType(evt.target.value)}>
                          <option value="0">Deposit</option>
                          <option value="1">Withdraw</option>
                      </Form.Select>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formFullname">
                    <Form.Label column sm="2">Amount</Form.Label>
                    <Col sm="4">
                      <Form.Control type="number" min="0" placeholder="Enter the Amount"
                        onChange={evt => setToUpdate(evt.target.value)} />
                    </Col>
                </Form.Group>
                <Button variant="primary" type="button"
                              onClick={() => updateBalance()}>Update
                </Button>
              </Form>
            </Col>
        </Container >
    )
}

export default Profile;