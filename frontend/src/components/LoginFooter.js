import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
// import { LinkedIn } from 'react-linkedin-login-oauth2';
// import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';
import InstagramLogin from 'react-instagram-login';
// import oauth from 'axios-oauth-client';

import axios from 'axios';
import { useHistory } from 'react-router-dom';
const LoginFooter = () => {
  let history = useHistory();
  const instaOnClick = () => {
    localStorage.setItem('instaLogin', true);
  };

  const responseInstagram = async (response) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    const { data } = await axios.post(
      '/api/users/instagramauth',
      {
        accessToken: response,
      },
      config
    );
    console.log(data);
    if (data) {
      localStorage.setItem('userInfo', JSON.stringify(data));
      history.push('/home');
    }
  };
  // const handleSuccessL = (response) => {
  //   console.log('hello', response);
  // };

  const responseFacebook = async (response) => {
    if (!localStorage.getItem('instaLogin')) {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/users/facebookauth',
        {
          accessToken: response.accessToken,
          userId: response.userID,
        },
        config
      );
      if (data) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        history.push('/home');
      }
    }
  };

  const responseSuccessGoogle = async (response) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    const { data } = await axios.post(
      '/api/users/googleauth',
      {
        tokenId: response.tokenId,
      },
      config
    );
    if (data) {
      localStorage.setItem('userInfo', JSON.stringify(data));
      history.push('/home');
    }
  };

  const responseErrorGoogle = (response) => {};

  return (
    <div>
      Login using <br></br>
      {localStorage.getItem('instaLogin') ? (
        ''
      ) : (
        <>
          <FacebookLogin
            appId="322905029180461"
            autoLoad={false}
            fields="name,email"
            callback={responseFacebook}
          />
        </>
      )}
      <div style={{ display: 'block', margin: '20px' }}></div>
      <GoogleLogin
        clientId="22649499080-6vnfmebfftpu386ivdepmen8u21duahf.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseSuccessGoogle}
        onFailure={responseErrorGoogle}
        cookiePolicy={'single_host_origin'}
      />
      <div style={{ display: 'block', margin: '20px' }}></div>
      {/* <LinkedIn
        clientId="865gdjwcbwoyue"
        onSuccess={handleSuccessL}
        redirectUri="https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=865gdjwcbwoyue&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2F&state=foobar&scope=r_liteprofile"
      >
        <img
          src={linkedin}
          alt="Log in with Linked In"
          style={{ maxWidth: '180px' }}
        />
      </LinkedIn> */}
      <div style={{ display: 'block', margin: '20px' }}></div>
      <span onClick={instaOnClick}>
        <InstagramLogin
          clientId="273737951098288"
          buttonText="Login"
          scope="user_profile"
          onSuccess={responseInstagram}
          onClick={instaOnClick}
        />
      </span>
    </div>
  );
};

export default LoginFooter;
