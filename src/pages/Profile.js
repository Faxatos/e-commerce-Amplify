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

function Profile(props) {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [toUpdate, setToUpdate] = useState(0);
    const [updateType, setUpdateType] = useState(0);

    useEffect(() => {
      if(props.isAuthenticated === false){
        navigate('/')
      } 
      setBalance(Number(props.balance))
    }, [navigate, props.isAuthenticated]);

    async function updateBalance() {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user)

      var newBal = (Number(updateType) === 0) ? (Number(user.attributes['custom:balance']) + Number(toUpdate)) : (Number(user.attributes['custom:balance']) - toUpdate)
      if(newBal < 0){
        console.log("error: negative balance. withdraw denied")
      }
      else{
        await Auth.updateUserAttributes(user, {
          'custom:balance': newBal.toString()
        });

        props.updateBalance(newBal)
        setBalance(newBal)
      }
    }

    return (
        < Container >
            <Col className="px-4 my-5">
              {
                (function(){
                  if (props.isBuyer === "true"){
                    return (<Row><h1>Buyer Profile: {props.username}</h1></Row>)
                  }
                  else if(props.isBuyer === "false"){
                    return (<Row><h1>Seller Profile: {props.username}</h1></Row>)
                  }
                })()
              }
              <Form>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextFullname">
                  <Form.Label column sm="2">
                    Full name:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={props.fullname} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                  <Form.Label column sm="2">
                    Email:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={props.email} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextAddress">
                  <Form.Label column sm="2">
                    Address:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={props.address} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formDescription">
                    <Form.Label column sm="2">
                      Description:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control plaintext rows={3} readOnly defaultValue={props.description} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formBalance">
                    <Form.Label column sm="2">
                      Balance (€):
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control plaintext rows={3} readOnly value={balance.toFixed(2)} />
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