// On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const bcrypt = require('bcrypt')
// On récupère notre model User ,créer avec le schéma mongoose
const User = require('../models/user');
// On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
    // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
    bcrypt.hash(req.body.password, 10)
      // On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la Base de Données mongoDB
      .then(hash => {
        const user = new User({
          // On passe l'email qu'on trouve dans le corps de la requête
          email: req.body.email,
          // On récupère le mdp hashé de bcrypt
          password: hash
        });
        // On enregistre l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({
            message: 'Utilisateur créé !'
          }))
          .catch(error => res.status(400).json({
            error
          })); // Si il existe déjà un utilisateur avec cette adresse email
      })
      .catch(error => res.status(500).json({
        error
      }));
  
  };
  
  exports.login = (req, res, next) => {
    // On doit trouver l'utilisateur dans la Base de Données qui correspond à l'adresse entrée par l'utilisateur
    User.findOne({
        email: req.body.email
      })
      .then(user => {
        // Si on trouve pas l'utilisateur on va renvoyer un code 401 "non autorisé"
        if (!user) {
          return res.status(401).json({
            error: 'Utilisateur non trouvé !'
          });
        }
        // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({
                error: 'Mot de passe incorrect !'
              });
            }
            res.status(200).json({ // Le serveur backend renvoie un token au frontend
              userId: user._id,
              // Permet de vérifier si la requête est authentifiée
              // on va pouvoir obtenir un token encodé pour cette authentification grâce à jsonwebtoken, on va créer des tokens et les vérifier
              token: jwt.sign( // Encode un nouveau token avec une chaine de développement temporaire
                {
                  userId: user._id
                }, // Encodage de l'userdID nécéssaire dans le cas où une requête transmettrait un userId (ex: modification d'une sauce)
                'RANDOM_TOKEN_SECRET', // Clé d'encodage du token qui peut être rendue plus complexe en production
             
                {
                  expiresIn: '24h'
                }
              )
          
             
            });
          })
          .catch(error => res.status(500).json({
            error
          }));
      })
      .catch(error => res.status(500).json({
        error
      }));
  };