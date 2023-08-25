// src/components/bootstrap-carousel.component.js
import React, { Component } from "react";

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class ModalProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            quantity: 1
        };
    }

    /*
    shouldComponentUpdate() {
        return false;
    }
    */

    setQuantity = (val) => {
        this.setState({quantity: val});
    }

    render() {

        return (
            <div>
                <Modal show={this.props.show} onHide={() => this.props.onHide()}>

                    <Modal.Header closeButton>
                        <Modal.Title>Add to Cart</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextName">
                            <Form.Label column sm="2">
                                Name:
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control plaintext readOnly defaultValue={this.props.name} />
                            </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextSeller">
                            <Form.Label column sm="2">
                                Seller:
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control plaintext readOnly defaultValue={this.props.seller} />
                            </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formNumberQuantity">
                            <Form.Label column sm="2">
                                Quantity:
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="number" defaultValue="1" onChange={(e) => this.setQuantity(e.target.value)} autoFocus/>
                            </Col>
                            </Form.Group>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.onHide()} >Close</Button>
                        <Button variant="primary" onClick={() => this.props.onClick({ qnty: this.state.quantity, name: this.props.name, seller: this.props.seller })}  >Add</Button>
                    </Modal.Footer>

                </Modal>
            </div>
        )
    };
}

export default ModalProduct;