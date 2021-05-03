import React from 'react';
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

const HomeScreen = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  let history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  return userInfo ? (
    <Container>
      <h1>Hello {userInfo.name}</h1>
      <button onClick={logoutHandler}>Logout</button>
    </Container>
  ) : (
    <Redirect to={'/'} />
  );
};

export default HomeScreen;
