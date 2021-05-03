import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const HomeScreen = () => {
  let history = useHistory();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  console.log(userInfo.name);
  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
  }, [userInfo]);
  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/login');
  };

  return userInfo ? (
    <Container>
      <h1>Hello {userInfo.name}</h1>
      <button onClick={logoutHandler}>Logout</button>
    </Container>
  ) : (
    history.push('/login')
  );
};

export default HomeScreen;
