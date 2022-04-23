const express = require('express');// Ajout de plugin externe nécessaire pour utiliser le router d'Express

const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config.js');

// Routes
router.get('/', auth, sauceCtrl.getAllSauces);// Route qui permet de récupérer toutes les sauces.
router.get('/:id', auth, sauceCtrl.getOneSauce);// Route qui permet de cliquer sur une des sauces précise.
router.post('/', auth, multer, sauceCtrl.createSauce);// Route qui permet de créer "une sauce".
router.put('/:id', auth, multer, sauceCtrl.modifySauce);// Route qui permet de modifier "une sauce".
router.delete('/:id', auth, sauceCtrl.deleteSauce);// Route qui permet de supprimer "une sauce".
router.post('/:id/like', auth, sauceCtrl.likeOrDislike); // Route qui permet de gérer les likes des sauces.

module.exports = router;