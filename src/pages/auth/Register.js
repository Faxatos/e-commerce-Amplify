import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Auth } from 'aws-amplify';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Register() {
    const navigate = useNavigate()

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState(0);
    const [fullname, setFullname] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');

    const handleRegister = async () => {
        try {
            let isBuyer;

            if(Number(userType) !== 0){

                if(Number(userType) === 1){
                    isBuyer = 'true';
                }
                else{
                    isBuyer = 'false';
                }
                
                //https://bobbyhadz.com/blog/aws-cognito-amplify-bad-bugged
                const { user } = await Auth.signUp({
                    username: username,
                    password: password,
                    attributes: {
                        email: email,
                        address:address,
                        name:fullname,
                        'custom:description':description,
                        'custom:isBuyer':isBuyer,
                        'custom:balance':'0'
                    }
                });

                navigate('/validate');
            }  
            else{
                console.log("error user type");
            }     
        } catch (err) { console.log(err) }
    }

    return (
        <Container>
            <Row className="px-4 my-5">
                <Col><h1>Register</h1></Col>
            </Row>
            <Row className="px-4 my-5">
                <Col sm={6}>
                    <Form>

                      <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"
                                onChange={evt => setEmail(evt.target.value)} />
                            <Form.Text className='text-muted'>
                                We'll never share your email!
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter User Name"
                                onChange={evt => setUserName(evt.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" minLength="8" placeholder="Enter Password"
                                onChange={evt => setPassword(evt.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Type of User</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={evt => setUserType(evt.target.value)}>
                                <option value="0">Click to select</option>
                                <option value="1">Buyer</option>
                                <option value="2">Seller</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formFullname">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Full name"
                                onChange={evt => setFullname(evt.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter Address"
                                onChange={evt => setAddress(evt.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter Description"
                                onChange={evt => setDescription(evt.target.value)}/>
                        </Form.Group>

                        <Button variant="primary" type="button"
                            onClick={handleRegister}>Register &gt;&gt;</Button>

                        &nbsp;&nbsp;
                        <Link
                            to='/login'>
                            <Button variant="outline-primary">Login</Button>
                        </Link>
                        &nbsp;&nbsp;
                        <Link
                            to='/'>
                            <Button variant="outline-primary">Cancel</Button>
                        </Link>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Register;