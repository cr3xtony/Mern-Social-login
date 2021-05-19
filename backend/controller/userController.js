const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const axios = require('axios');
const oauth = require('axios-oauth-client');
const ErrorHandler = require('../utils/errorHandler');
const client = new OAuth2Client(
  '22649499080-6vnfmebfftpu386ivdepmen8u21duahf.apps.googleusercontent.com'
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: '30d',
  });
};

exports.authUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: 'databasepassword',
      token: generateToken(user._id),
    });
  } else {
    return next(new ErrorHandler('Email or Password invalid', 404));
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler('User Exists', 404));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      message: 'user created',
    });
  } else {
    return next(new ErrorHandler('Invalid User Data', 404));
  }
};

exports.googleauth = async (req, res, next) => {
  const { tokenId } = req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        '22649499080-6vnfmebfftpu386ivdepmen8u21duahf.apps.googleusercontent.com',
    })
    .then(async (response) => {
      const { email_verified, name, email } = response.payload;

      if (email_verified) {
        const userExist = await User.findOne({ email });
        if (userExist) {
          const user = await User.findOne({ email });
          if (user.matchPassword('mysamplepassword')) {
            res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              password: 'mysamplepassword',
              token: generateToken(user._id),
            });
          } else {
            res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              password: 'databasepassword',
              token: generateToken(user._id),
            });
          }
        } else {
          const user = await User.create({
            name,
            email,
            password: 'mysamplepassword',
          });
          if (user) {
            res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              password: 'mysamplepassword',
              token: generateToken(user._id),
            });
          } else {
            return next(new ErrorHandler('Invalid User data', 404));
          }
        }
      }
    });
};

exports.facebookauth = async (req, res, next) => {
  const { userId, accessToken } = req.body;
  let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
  fetch(urlGraphFacebook, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then(async (response) => {
      const { email, name } = response;
      if (email) {
        const userExist = await User.findOne({ email });
        if (userExist) {
          const user = await User.findOne({ email });
          if (user.matchPassword('mysamplepassword')) {
            res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              password: 'mysamplepassword',
              token: generateToken(user._id),
            });
          } else {
            res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              password: 'databasepassword',
              token: generateToken(user._id),
            });
          }
        } else {
          const user = await User.create({
            name,
            email,
            password: '12345',
          });
          if (user) {
            if (user.matchPassword('mysamplepassword')) {
              res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                password: 'mysamplepassword',
                token: generateToken(user._id),
              });
            } else {
              res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                password: 'databasepassword',
                token: generateToken(user._id),
              });
            }
          } else {
            return next(new ErrorHandler('Invalid User Data', 404));
          }
        }
      }
    });
};

exports.instagramauth = async (req, res, next) => {
  const { accessToken } = req.body;
  const getAuthorizationCode = oauth.client(axios.create(), {
    url: 'https://instagram.com/oauth/access_token',
    grant_type: 'authorization_code',
    client_id: '273737951098288',
    client_secret: 'af062c703eae1b7f4138917ec89e97f5',
    redirect_uri: 'https://localhost:3000/',
    code: accessToken,
  });

  const auth = await getAuthorizationCode();

  const user = await axios.get(
    `https://graph.instagram.com/me?fields=id,username&access_token=${auth.access_token}`
  );

  const username = user.data.username;
  const userid = user.data.id;

  const userExist = await User.findOne({ instaUserId: userid });
  if (userExist) {
    if (userExist.matchPassword('mysamplepassword')) {
      res.json({
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        password: 'mysamplepassword',
        token: generateToken(userExist._id),
      });
    } else {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: 'databasepassword',
        token: generateToken(user._id),
      });
    }
  } else {
    const user = await User.create({
      name: username,
      instaUserId: userid,
      password: 'mysamplepassword',
    });
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: 'mysamplepassword',
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  }
};

exports.userUpdate = async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  if (user) {
    let setPassword = 'mysamplepassword';
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    if (req.body.password) {
      user.password = req.body.password;
      setPassword = 'databasepassword';
    }
    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      password: setPassword,
      token: updateUser.token,
    });
  } else {
    return next(new ErrorHandler('User Not Found', 404));
  }
};

exports.checkUserPass = async (req, res, next) => {
  const { userId, password } = req.body;

  const user = await User.findOne({ _id: userId });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: 'databasepassword',
      token: user.token,
    });
  } else {
    return next(new ErrorHandler('Invalid password', 404));
  }
};
