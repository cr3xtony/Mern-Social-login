const express = require('express');
const { authUser } = require('../controller/userController');
const { registerUser } = require('../controller/userController');
const { googleauth } = require('../controller/userController');
const { facebookauth } = require('../controller/userController');
const { userUpdate } = require('../controller/userController');
const { instagramauth } = require('../controller/userController');
const { checkUserPass } = require('../controller/userController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/googleauth', googleauth);
router.post('/facebookauth', facebookauth);
router.post('/instagramauth', instagramauth);
router.post('/home', protect, userUpdate);
router.post('/checkuserpass', checkUserPass);

module.exports = router;
