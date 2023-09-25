import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Auth } from 'aws-amplify';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Snackbar from '../../components/SnackBar/SnackBar';

import { useAuthContext } from '../../contexts/AuthContext'

function Login(props) {
    const { updateAuthStatus } = useAuthContext();

    const navigate = useNavigate()
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await Auth.signIn(username, password)

            updateAuthStatus(true)
            props.addCustomSnack(<Snackbar variant="success" message="Logged in!" />, {
                horizontal: "top",
                vertical: "right"
            })
            navigate('/home')
        } catch (err) { 
            props.addCustomSnack(<Snackbar variant="error" message={err.message} />, {
            horizontal: "top",
            vertical: "right"
        }) }
    }

    return (
        <Container>
            <Row className="px-4 my-5">
                <Col><h1>Login</h1></Col>
            </Row>
            <Row className="px-4 my-5">
                <Col sm={6}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="email" placeholder="Enter username"
                                onChange={evt => setUsername(evt.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" minLength="8" placeholder="Enter Password"
                                onChange={evt => setPassword(evt.target.value)} />
                        </Form.Group>

                        <Button variant="primary" type="button"
                            onClick={() => handleLogin()}>Login &gt;&gt;</Button>
                        &nbsp;&nbsp;
                        <Link
                            to='/register'>
                            <Button variant="outline-primary">Register</Button>
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

export default Login;