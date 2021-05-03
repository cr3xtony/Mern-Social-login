const express = require('express');
const { authUser } = require('../controller/userController');
const { registerUser } = require('../controller/userController');
const { googleauth } = require('../controller/userController');
const { facebookauth } = require('../controller/userController');
const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/googleauth', googleauth);
router.post('/facebookauth', facebookauth);

module.exports = router;
