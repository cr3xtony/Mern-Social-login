import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const LoginFooter = () => {
  let history = useHistory();
  const responseFacebook = async (response) => {
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
      <FacebookLogin
        appId="322905029180461"
        render={(renderProps) => (
          <button
            style={{ color: 'blue', outline: 'none' }}
            onClick={renderProps.onClick}
          >
            <i className="fab fa-facebook-square fa-5x "></i>
          </button>
        )}
        callback={responseFacebook}
      />
      <div style={{ display: 'block', margin: '20px' }}></div>
      <GoogleLogin
        clientId="22649499080-6vnfmebfftpu386ivdepmen8u21duahf.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseSuccessGoogle}
        onFailure={responseErrorGoogle}
        cookiePolicy={'single_host_origin'}
      />
      , ,
    </div>
  );
};

export default LoginFooter;
