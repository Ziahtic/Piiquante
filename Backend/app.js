//module express - codage plus rapide et simplifié
const express =require ('express');

// Installation du module Helmet pour prévenir les failles sécurités
const helmet = require('helmet');

//Installation du module bodyparse
const bodyParser = require('body-parser');

//Installation du module morgan -> suivi des requêtes
const morgan = require('morgan');

// Installation du module CORS /Partage des Ressources entre Origines Multiples
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

//Installation du module Mongoose
const mongoose = require('mongoose');


//Chemin d'accès vers les images
const path = require('path');

// Importation du module "express-mongo-sanitize" -> prévention des attaques par injection de code dans les "form"
const mongoSanitize = require("express-mongo-sanitize");

//rappatriation des routes "user" et "sauces"
const userRoutes = require('./routes/user'); 
const sauceRoutes = require('./routes/sauces');

//déclaration de la constante express
const app = express();

// Déclaration variable d'environnement de connection
const MONGODB_URI = process.env.MONGODB_URI
;

// connection à la data base MongoDB Atlas
mongoose
.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));

// Configuration "express-mongo-sanitze" (allowDots et replaceWith en globale)
app.use(
    mongoSanitize({
      allowDots: true,
      replaceWith: "_",
    })
  );

// Cross-Origin Resource Sharing ou Partage des Ressources - accès au front - lien entre les 2 serveurs grâce aux autorisations ci-dessous
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //->tout le monde peut se connecter
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //->les requêtes "get post put delete patch" sont acceptées
    next(); //->permet de passer à la lecture des autres middlewares
});

// transforme le corps de la requete en objet js utilisable -> Middleware
app.use(express.json());
app.use(bodyParser.json()); //->permet de lire les éléments parser (format json) reçu par le front
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev")); 

//app "sauce route" mis en place avec les chemin/ routeur
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

//route pour les fichiers "static" (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

//exportation de l'application
module.exports = app;