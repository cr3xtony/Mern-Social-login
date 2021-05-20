import React, { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Message from '../components/Message';

const HomeScreen = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  let history = useHistory();

  useEffect(() => {
    if (userInfo) {
      userInfo.email ? setEmail(userInfo.email) : setEmail('');
      if (userInfo.userName) {
        setUserName(userInfo.userName);
      }
    }
  }, [userInfo]);
  if (!userInfo) {
    <Redirect to={'/'} />;
  }

  const logoutHandler = () => {
    localStorage.removeItem('instaLogin');
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userInfo.email) {
      if (newEmail === confirmEmail) {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const userId = userInfo._id;
        const { data } = await axios.post(
          '/api/users/home',
          {
            userId,
            email: newEmail,
          },
          config
        );
        if (data) {
          localStorage.setItem('userInfo', JSON.stringify(data));
        }
      } else {
        setError('Email not matching');
      }
    }

    if (userInfo.password === 'mysamplepassword') {
      const userId = userInfo._id;
      if (newPassword === confirmPassword) {
        if (newPassword.length > 3) {
          const config = {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const { data } = await axios.post(
            '/api/users/home',
            {
              userId,
              password: newPassword,
            },
            config
          );
          if (data) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            setSuccess('Profile Updated');
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
            setError('');
          }
        } else {
          setError('Password must be 4 character or long');
        }
      } else {
        setError('Password not matching');
      }
    } else {
      const userId = userInfo._id;
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      try {
        const { data } = await axios.post(
          '/api/users/checkuserpass',
          {
            userId,
            password: currentPassword,
          },
          config
        );
        if (data) {
          if (newPassword === confirmPassword) {
            if (newPassword.length > 3) {
              const config = {
                headers: {
                  'Content-type': 'application/json',
                  Authorization: `Bearer ${userInfo.token}`,
                },
              };
              const { data } = await axios.post(
                '/api/users/home',
                {
                  userId,
                  password: newPassword,
                },
                config
              );
              if (data) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                setSuccess('Profile updated successfully');
                setNewPassword('');
                setCurrentPassword('');
                setConfirmPassword('');
                setError('');
              }
            } else {
              setError('Password must be 4 character or long');
            }
          } else {
            setError('Password not matching');
          }
        }
      } catch (error) {
        setSuccess('');
        setError(error.response.data.message);
      }
    }

    if (!userInfo.userName) {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const userId = userInfo._id;
      const { data } = await axios.post(
        '/api/users/home',
        {
          userId,
          userName,
        },
        config
      );
      if (data) {
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
    }
  };

  return userInfo ? (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Profile</h1> <button onClick={logoutHandler}>Logout</button>
      </div>
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">Profile Updated</Message>}
      <Form onSubmit={submitHandler}>
        {userInfo.email ? (
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              readOnly
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        ) : (
          <>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicConfirmEmail">
              <Form.Label>Confirm Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </Form.Group>
          </>
        )}
        {userInfo.userName ? (
          <>
            <Form.Group controlId="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                readOnly
                type="text"
                placeholder="Enter User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
          </>
        ) : (
          <>
            <Form.Group controlId="username">
              <Form.Label>Enter New User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
          </>
        )}

        {userInfo.password === 'mysamplepassword' ? (
          <>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </>
        ) : (
          <>
            <Form.Group controlId="formBasicCUrrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </>
        )}

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  ) : (
    <Redirect to={'/'} />
  );
};

export default HomeScreen;
