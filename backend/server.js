const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error');

const connectDB = require('./config/db');
const index = require('./routes/index');

dotenv.config();
connectDB();

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(express.json());

// passport.use(
//   new facebookStrategy(
//     {
//       clientID: '322905029180461',
//       clientSecret: '03ade8503c581db66f580723c41e3980',
//       callbackURL: 'http://localhost:5000/facebook/callback',
//       profileFields: ['id', 'displayName', 'gender'],
//     },
//     function (token, refreshToken, profile, done) {
//       console.log(profile);
//       return done(null, profile);
//     }
//   )
// );

app.use('/api/', index);
app.use(errorMiddleware);
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
);
app.listen(
  process.env.PORT,
  console.log(`Server running on port ${process.env.PORT}`)
);
