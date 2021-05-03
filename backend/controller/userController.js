const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const client = new OAuth2Client(
  '22649499080-6vnfmebfftpu386ivdepmen8u21duahf.apps.googleusercontent.com'
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: '30d',
  });
};

exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    res.json('invalid username or password');
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error('User already exists');
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
    res.status(400);
    throw new Error('Invalid user data');
  }
};

exports.googleauth = async (req, res) => {
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
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
          });
        } else {
          const user = await User.create({
            name,
            email,
            password: '12345',
          });
          if (user) {
            res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              token: generateToken(user._id),
            });
          } else {
            res.status(400);
            throw new Error('Invalid user data');
          }
        }
      }
    });
};

exports.facebookauth = async (req, res) => {
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
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
          });
        } else {
          const user = await User.create({
            name,
            email,
            password: '12345',
          });
          if (user) {
            res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              token: generateToken(user._id),
            });
          } else {
            res.status(400);
            throw new Error('Invalid user data');
          }
        }
      }
    });
};
