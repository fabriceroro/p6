// Importation d'express => Framework basé sur node.js.
const express = require('express');
// Permet d'extraire l'objet json des requête Post.
const bodyParser = require('body-parser');
// Plugin Mongoose pour se connecter à la base Mongo Db ,pour pouvoir utliser la base de données.
const mongoose = require('mongoose');
// Plugin qui sert dans l'uplaod des images et permet de travailler avec les répertoires et chemin de fichier 
const path = require('path');
// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require('dotenv').config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
// Connection à la base de données MongoDB avec la sécurité vers le fichier .env pour cacher le mot de passe
// L'un des avantages que nous avons à utiliser Mongoose pour gérer notre base de données MongoDB est que nous pouvons implémenter des schémas de données stricts
// qui permettent de rendre notre application plus robuste //
mongoose.connect(
  process.env.DB_CONNECTION, 
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); 

app.use((req, res, next) => {
  // Permet d'accéder à notre API depuis n'importe quelle origine 
    res.setHeader('Access-Control-Allow-Origin', '*');
  // Permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Permet d'envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());
// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;