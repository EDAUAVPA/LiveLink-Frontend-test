const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const verifyToken = require('../middleware/verifyToken.js');

// route: /api/user

//router.get('/', userController.getUsers);

router.post('/login', userController.validateUser);

router.get('/info', verifyToken, userController.getUserId);

router.get('/name/:user_id', verifyToken, userController.getUsername);

router.post('/create', userController.saveUser);

module.exports = router;