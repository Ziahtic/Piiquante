//module express - codage plus rapide et simplifié
const express =require ('express');

//déclaration de la constante express
const app = express();

// module de sécurité 'http' pour l'app.helmet (installe des http headers différents)
const helmet = require('helmet');
app.use(helmet()); // -> utilisation de helmet pour la sécurité

//Installation du module Mongoose
const mongoose = require('mongoose');



//Chemin d'accès vers les images
const path = require('path');

//rappatriation des routes "users" et "sauces"
const userRoutes = require('./routes/auth'); 
const sauceRoutes = require('./routes/sauces');

// connection à la data base MongoDB Atlas
mongoose
.connect(process.env.DB_MONGODB, //->cacher les données
    {useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));

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