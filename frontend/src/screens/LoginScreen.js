import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoginFooter from '../components/LoginFooter';
import { useHistory } from 'react-router-dom';
import Message from '../components/Message';
const LoginScreen = () => {
  let history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );
      localStorage.setItem('userInfo', JSON.stringify(data));
      history.push('/home');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <Container>
      <h1>Sign In</h1>

      {message && <Message variant="danger">Email or Password Invalid</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
        <p>
          Or <Link to="/register">Register </Link>
        </p>
        <LoginFooter />
      </Form>
    </Container>
  );
};

export default LoginScreen;
