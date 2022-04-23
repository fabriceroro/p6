const express = require('express');
const router = express.Router();
// On associe les fonctions aux différentes routes, on importe le controller
const userCtrl = require('../controllers/user');

// Routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;